const UserRepository = require("../repositories/userRepository")
// Note: We don't import User model here anymore to instatiate it before saving, 
// because we need to separate Auth data from User data. 
// The Repository will handle the creation of the User entity after Auth.

exports.createUser = async (userData) => {
  // userData: { firstName, lastName, email, password, role, photoProfile, birthdate }
  return await UserRepository.save(userData) // Pass raw DTO
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