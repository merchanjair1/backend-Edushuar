const userUseCases = require("../usecases/userUseCases")
const { success, error } = require("../utils/responseHandler")



exports.createUser = async (req, res) => {
  try {
    const data = req.body

    // If file is uploaded, set photoProfile
    if (req.file) {
      data.photoProfile = req.file.path
    }

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
    // Check query params first, then body (since it's a POST)
    const page = parseInt(req.query.page || req.body.page) || 1
    const limit = parseInt(req.query.limit || req.body.limit) || 10

    const result = await userUseCases.getAllUsers(page, limit)
    return success(res, result) // result contains { items, pagination }
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
    console.log("DEBUG: Update Body:", JSON.stringify(req.body, null, 2))

    // Extract ID and separate potentially nested 'data' from the rest of the body
    const { id, data, ...restBody } = req.body

    if (!id) return error(res, "Se requiere el ID del usuario para actualizar", 400)

    // Determine the update payload
    let updateData = {}

    // 1. If 'data' is provided (JSON string or object) -> Use it (Legacy/Strict mode)
    if (data) {
      updateData = typeof data === 'string' ? JSON.parse(data) : data
    }
    // 2. Otherwise, use the flattened fields from restBody (Standard Form-Data)
    else {
      updateData = { ...restBody }
    }

    // If file is uploaded, override photoProfile
    if (req.file) {
      updateData.photoProfile = req.file.path
    }

    await userUseCases.updateUser(id, updateData)

    // Fetch updated user to return
    const updatedUser = await userUseCases.getUserById(id)

    return success(res, { message: "Usuario actualizado", user: updatedUser })
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

