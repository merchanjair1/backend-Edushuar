const UserRepository = require("../repositories/userRepository")
const AuthRepository = require("../repositories/authRepository")
const User = require("../models/userModel")

exports.createUser = async (userData) => {
  // Role Normalization
  let roleInput = (userData.role || "").toLowerCase().trim()
  let finalRole = "student" // Default

  if (roleInput === "administrador" || roleInput === "admin") {
    finalRole = "admin"
  } else if (roleInput === "estudiante" || roleInput === "student" || roleInput === "") {
    finalRole = "student"
  } else {
    throw new Error("Rol inválido. Roles permitidos: 'estudiante' (por defecto) o 'administrador'.")
  }

  // Assign mapped role back to userData for consistency
  userData.role = finalRole

  // 1. Create Credential (if email/password provided)
  let uid = null
  if (userData.email && userData.password) {
    const authCredential = await AuthRepository.createCredential(userData.email, userData.password)
    uid = authCredential.uid
    // Save explicit auth record
    await AuthRepository.saveFirestoreAuth(uid, userData.email, userData.password)
  } else {
    // If no auth, we shouldn't really be creating a user in this system structure, 
    // but if needed we could generate a random ID. 
    // For now, assuming email/password are required for creation.
    throw new Error("Email y password son requeridos para crear un usuario")
  }

  // Date Parsing
  let parsedDate = null;
  if (userData.birthdate) {
    if (typeof userData.birthdate === 'string' && userData.birthdate.includes('/')) {
      // Assume DD/MM/YYYY
      const [day, month, year] = userData.birthdate.split('/')
      parsedDate = new Date(`${year}-${month}-${day}`)
    } else {
      parsedDate = new Date(userData.birthdate)
    }
    // Check for Invalid Date
    if (isNaN(parsedDate.getTime())) {
      parsedDate = null // or throw error? For now, we set to null to avoid crash.
    }
  }

  // 2. Create User Entity
  const newUser = new User({
    id: uid,
    authId: uid,
    email: userData.email, // Now storing email in Firestore
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: finalRole,
    photoProfile: userData.photoProfile || null,
    birthdate: parsedDate,
    status: "active",
    createdAt: new Date()
  })

  // 3. Save Profile
  return await UserRepository.saveProfile(newUser)
}

exports.getAllUsers = async (page = 1) => {
  const { users, total } = await UserRepository.findAll()
  return {
    items: users,
    pagination: {
      total,
      page: parseInt(page),
      totalPages: 1
    }
  }
}

exports.getUserById = async (id) => {
  return await UserRepository.findById(id)
}

exports.updateUser = async (id, data) => {
  // Separate Auth fields (password, email) from Store fields
  // We keep 'email' in StoreData for listing purposes, but 'password' MUST NOT go to Firestore.
  const { password, ...storeData } = data

  // Handle Role Normalization if 'role' is present in data
  // (Verify if role is empty string, reset to student)
  if (data.hasOwnProperty('role')) {
    let roleInput = (data.role || "").toLowerCase().trim()
    if (roleInput === "") {
      storeData.role = "student"
    } else if (roleInput === "administrador" || roleInput === "admin") {
      storeData.role = "admin"
    } else if (roleInput === "estudiante" || roleInput === "student") {
      storeData.role = "student"
    }
    // If invalid, we could throw error or ignore. 
    // For now, let's stick to the request: "empty -> student"
  }

  // 1. If email or password provided, update Auth Credential
  if (data.email || password) {
    const authUpdates = {}
    if (data.email) authUpdates.email = data.email
    if (password) authUpdates.password = password

    await AuthRepository.updateCredential(id, authUpdates)

    // Also update explicit 'auth' collection in Firestore
    if (data.email || password) {
      // Pass raw password to be hashed inside repo, or email
      const firestoreAuthUpdates = {}
      if (data.email) firestoreAuthUpdates.email = data.email
      if (password) firestoreAuthUpdates.password = password

      await AuthRepository.updateFirestoreAuth(id, firestoreAuthUpdates)
    }
  }

  // 2. Update Firestore Profile (without password)
  return await UserRepository.update(id, storeData)
}

exports.deleteUser = async (id) => {
  return await UserRepository.delete(id)
}

// Login email/password
exports.login = async ({ email, password }) => {
  return await UserRepository.login(email, password)
}

// Login Google
exports.googleLogin = async (idToken) => {
  return await UserRepository.googleLogin(idToken)
}

exports.createUsersBulk = async (usersData) => {
  if (!Array.isArray(usersData)) throw new Error("Se requiere un arreglo de usuarios")

  // Pre-process roles and dates
  const processedData = usersData.map(userData => {
    let roleInput = (userData.role || "").toLowerCase().trim()
    let finalRole = "student"
    if (roleInput === "administrador" || roleInput === "admin") {
      finalRole = "admin"
    }

    let parsedDate = null
    if (userData.birthdate) {
      if (typeof userData.birthdate === 'string' && userData.birthdate.includes('/')) {
        const [day, month, year] = userData.birthdate.split('/')
        parsedDate = new Date(`${year}-${month}-${day}`)
      } else {
        parsedDate = new Date(userData.birthdate)
      }
      if (isNaN(parsedDate.getTime())) parsedDate = null
    }

    return { ...userData, role: finalRole, parsedBirthdate: parsedDate }
  })

  // 1. Bulk Create Credentials
  const authResults = await AuthRepository.bulkCreateCredentials(processedData)
  const successfulAuths = authResults.filter(r => r.success)
  const failures = authResults.filter(r => !r.success)

  if (successfulAuths.length === 0) {
    return {
      message: "No se pudo crear ningún usuario",
      successCount: 0,
      failCount: failures.length,
      failures: failures.map(f => ({ email: f.email, error: f.error }))
    }
  }

  // 2. Prepare Entities and Firestore Auth records
  const userEntities = []
  for (const auth of successfulAuths) {
    const data = auth.originalData

    // Save to explicit 'auth' collection as done in individual createUser
    if (data.password) {
      await AuthRepository.saveFirestoreAuth(auth.uid, auth.email, data.password)
    }

    userEntities.push(new User({
      id: auth.uid,
      authId: auth.uid,
      email: auth.email,
      firstName: data.firstName || "Usuario",
      lastName: data.lastName || "EduShuar",
      role: data.role,
      photoProfile: data.photoProfile || null,
      birthdate: data.parsedBirthdate,
      status: "active",
      createdAt: new Date()
    }))
  }

  // 3. Bulk Save Profiles
  await UserRepository.bulkSaveProfiles(userEntities)

  return {
    message: "Creación masiva de usuarios completada",
    successCount: successfulAuths.length,
    failCount: failures.length,
    failures: failures.map(f => ({ email: f.email, error: f.error }))
  }
}
