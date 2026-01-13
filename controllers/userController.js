const userUseCases = require("../usecases/userUseCases")
const { success, error } = require("../utils/responseHandler")



exports.createUser = async (req, res) => {
  try {
    const data = req.body

    // If file is uploaded, set photoProfile
    if (req.file) {
      data.photoProfile = req.file.path
    }

    // Handle JSON parsing if data comes as string in form-data
    // Note: Since multer parses body, usually non-file fields are in req.body.
    // However, if the client sends a "data" JSON string field alongside the file, we parse it.
    // If the client sends individual fields (firstName, lastName, etc.), req.body has them directly.
    // I will assume standard fields for now, but keeping the "data" parsing pattern from updateUser if applicable 
    // might be confusing here if creating from scratch. 
    // Let's assume standard form-data fields: req.body = { firstName: '...', ... }

    // If the user sends a single "data" field containing JSON (like in updateUser example):
    let userData = { ...data }
    if (data.data && typeof data.data === 'string') {
      userData = { ...JSON.parse(data.data), ...userData }
      delete userData.data
    }

    const user = await userUseCases.createUser(userData)
    return success(res, { user }, 201)
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

    // If file is uploaded, update photoProfile
    if (req.file) {
      // Handle case where data might be a string if sent as form-data
      const updateData = typeof data === 'string' ? JSON.parse(data) : (data || {})
      updateData.photoProfile = req.file.path
      await userUseCases.updateUser(id, updateData)
    } else {
      await userUseCases.updateUser(id, data)
    }

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

