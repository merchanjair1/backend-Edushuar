const userUseCases = require("../usecases/userUseCases")
const { success, error } = require("../utils/responseHandler")

exports.createUser = async (req, res) => {
  try {
    const { user, token } = await userUseCases.createUser(req.body)
    return success(res, { id: user.id, token }, 201)
  } catch (e) {
    return error(res, e.message, 400)
  }
}

exports.listUsers = async (req, res) => {
  try {
    const users = await userUseCases.getAllUsers()
    return success(res, { users })
  } catch (e) {
    return error(res, e.message)
  }
}

exports.getUser = async (req, res) => {
  try {
    const { id } = req.body
    const user = await userUseCases.getUserById(id)
    if (!user) return error(res, "Usuario no encontrado", 404)
    return success(res, { user })
  } catch (e) {
    return error(res, e.message)
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id, data } = req.body
    await userUseCases.updateUser(id, data)
    return success(res, { message: "Usuario actualizado" })
  } catch (e) {
    return error(res, e.message, 400)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body
    await userUseCases.deleteUser(id)
    return success(res, { message: "Usuario eliminado" })
  } catch (e) {
    return error(res, e.message)
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return error(res, "Email y password son requeridos", 400)

    const { user, token } = await userUseCases.login({ email, password })
    return success(res, { user, token })
  } catch (e) {
    return error(res, e.message, 400)
  }
}

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) return error(res, "Se requiere idToken", 400)

    const { user, token } = await userUseCases.googleLogin(idToken)
    return success(res, { user, token })
  } catch (e) {
    return error(res, e.message, 400)
  }
}
