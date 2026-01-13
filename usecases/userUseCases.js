const UserRepository = require("../repositories/UserRepository")
const User = require("../models/userModel")

exports.createUser = async ({ username, email, password, role, photoProfile }) => {
  const user = new User({ username, email, password, role, photoProfile })
  return await UserRepository.save(user)
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