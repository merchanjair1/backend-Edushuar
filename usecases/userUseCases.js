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
    firstName: userData.firstName,
    lastName: userData.lastName,
    // email is not in User model usually but we pass it effectively via authId link
    role: finalRole,
    photoProfile: userData.photoProfile || null,
    birthdate: parsedDate,
    status: "active",
    createdAt: new Date()
  })

  // 3. Save Profile
  return await UserRepository.saveProfile(newUser)
}

exports.getAllUsers = async () => {
  return await UserRepository.findAll()
}

exports.getUserById = async (id) => {
  return await UserRepository.findById(id)
}

exports.updateUser = async (id, data) => {
  return await UserRepository.update(id, data)
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