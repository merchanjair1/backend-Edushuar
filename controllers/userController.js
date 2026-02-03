const userUseCases = require("../usecases/userUseCases")
const { success, error } = require("../utils/responseHandler")
const { uploadBase64 } = require("../utils/uploadHandler")



exports.createUser = async (req, res) => {
  try {
    const data = req.body

    // Handle Base64 Image
    if (data.photoProfile) {
      data.photoProfile = await uploadBase64(data.photoProfile)
    }

    // No need to parse 'data' string anymore as we expect pure JSON body without multipart
    // But keeping it safe in case legacy calls still send it (though middleware is gone)
    let userData = { ...data }

    const user = await userUseCases.createUser(userData)
    return success(res, { user }, 201)
  } catch (e) {
    return error(res, e.message, 400)
  }
}

exports.listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || req.body.page) || 1

    const result = await userUseCases.getAllUsers(page)
    return success(res, result)
  } catch (e) {
    return error(res, e.message)
  }
}

exports.getUser = async (req, res) => {
  try {
    const { id } = req.body
    if (!id) return error(res, "Se requiere el ID del usuario", 400)
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

    const { id, ...updateData } = req.body

    if (!id) return error(res, "Se requiere el ID del usuario para actualizar", 400)

    // Handle Base64 Image
    if (updateData.photoProfile) {
      updateData.photoProfile = await uploadBase64(updateData.photoProfile)
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
    if (!id) return error(res, "Se requiere el ID del usuario", 400)
    await userUseCases.deleteUser(id)
    return success(res, { message: "Usuario eliminado" })
  } catch (e) {
    return error(res, e.message)
  }
}

