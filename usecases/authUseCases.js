const AuthRepository = require("../repositories/authRepository")
const UserRepository = require("../repositories/userRepository")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.JWT_SECRET || "mi_super_secreto"

exports.register = async (data) => {
    // 1. Create Credential (Auth Layer)
    const authCredential = await AuthRepository.createCredential(data.email, data.password)

    // 2. Create Profile (Domain/Data Layer)
    const newUser = new User({
        id: authCredential.uid,
        authId: authCredential.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email, // Passing purely for convenience or consistency if model has it (Model doesn't have it, but useful for token)
        role: "student",
        photoProfile: null,
        birthdate: data.birthdate,
        status: "active",
        createdAt: new Date()
    })

    await UserRepository.saveProfile(newUser)

    // 3. Generate Token
    const token = jwt.sign(
        { uid: newUser.id, email: data.email, role: newUser.role },
        SECRET_KEY,
        { expiresIn: "7d" }
    )

    return { user: { ...newUser, email: data.email }, token }
}

exports.login = async ({ email, password }) => {
    // 1. Verify Credential
    const authData = await AuthRepository.signInWithEmail(email, password)

    // 2. Get Profile
    const userProfile = await UserRepository.findById(authData.uid)

    if (!userProfile) throw new Error("Perfil de usuario no encontrado")

    // 3. Generate Token
    const token = jwt.sign(
        { uid: userProfile.id, email: email, role: userProfile.role },
        SECRET_KEY,
        { expiresIn: "7d" }
    )

    return { user: { ...userProfile, email }, token }
}

exports.googleLogin = async (idToken) => {
    // 1. Verify Token
    const googleData = await AuthRepository.verifyGoogleToken(idToken)

    // 2. Check/Create Profile
    let userProfile = await UserRepository.findById(googleData.uid)

    if (!userProfile) {
        const nameParts = (googleData.name || "").split(" ")
        const firstName = nameParts[0] || "Sin nombre"
        const lastName = nameParts.slice(1).join(" ") || ""

        userProfile = new User({
            id: googleData.uid,
            authId: googleData.uid,
            email: googleData.email,
            firstName: firstName,
            lastName: lastName,
            role: "student",
            photoProfile: googleData.picture,
            status: "active",
            createdAt: new Date()
        })
        await UserRepository.saveProfile(userProfile)
    }

    // 3. Generate Token
    const token = jwt.sign(
        { uid: userProfile.id, email: googleData.email, role: userProfile.role },
        SECRET_KEY,
        { expiresIn: "7d" }
    )

    return { user: { ...userProfile, email: googleData.email }, token }
}

exports.googleRegister = async (idToken) => {
    // In Google Sign In, register and login are often the same flow (Upsert).
    // However, to keep strict architecture, we expose this method.
    // Logic is identical: Verify Token -> Create if not exists -> Return Token.
    return await this.googleLogin(idToken)
}

exports.requestPasswordReset = async (email) => {
    if (!email) throw new Error("El email es requerido")

    try {
        await AuthRepository.sendPasswordResetEmail(email)
        return { success: true, message: "Correo de restablecimiento enviado exitosamente" }
    } catch (error) {
        console.error("Error sending password reset:", error.message)

        // Check if error is because user doesn't exist
        if (error.message.includes("EMAIL_NOT_FOUND") || error.message.includes("USER_NOT_FOUND")) {
            throw new Error("El correo electrónico no está registrado")
        }

        // Re-throw other errors
        throw new Error("Error al enviar el correo de restablecimiento: " + error.message)
    }
}

exports.registerMassive = async (usersData) => {
    if (!Array.isArray(usersData)) throw new Error("Se requiere un arreglo de usuarios")

    // 1. Bulk Create Credentials
    const authResults = await AuthRepository.bulkCreateCredentials(usersData)

    const successfulAuths = authResults.filter(r => r.success)
    const failedAuths = authResults.filter(r => !r.success)

    if (successfulAuths.length === 0) {
        return {
            message: "No se pudo registrar ningún usuario",
            successCount: 0,
            failCount: failedAuths.length,
            failures: failedAuths.map(f => ({ email: f.email, error: f.error }))
        }
    }

    // 2. Prepare User Entities for successful auths
    const userEntities = successfulAuths.map(auth => {
        const data = auth.originalData
        return new User({
            id: auth.uid,
            authId: auth.uid,
            firstName: data.firstName || "Usuario",
            lastName: data.lastName || "EduShuar",
            email: auth.email,
            role: data.role || "student",
            photoProfile: null,
            birthdate: data.birthdate || null,
            status: "active",
            createdAt: new Date()
        })
    })

    // 3. Bulk Save Profiles in Firestore
    await UserRepository.bulkSaveProfiles(userEntities)

    return {
        message: "Registro masivo completado",
        successCount: successfulAuths.length,
        failCount: failedAuths.length,
        failures: failedAuths.map(f => ({ email: f.email, error: f.error }))
    }
}
