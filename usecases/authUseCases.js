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
