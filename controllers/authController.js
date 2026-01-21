const authUseCases = require("../usecases/authUseCases")
const { success, error } = require("../utils/responseHandler")

exports.register = async (req, res) => {
    try {
        const { user, token } = await authUseCases.register(req.body)
        return success(res, { user, token }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return error(res, "Email y password son requeridos", 400)

        const { user, token } = await authUseCases.login({ email, password })
        return success(res, { user, token })
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body
        if (!idToken) return error(res, "Se requiere idToken", 400)

        const { user, token } = await authUseCases.googleLogin(idToken)
        return success(res, { user, token })
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.googleRegister = async (req, res) => {
    try {
        const { idToken } = req.body
        if (!idToken) return error(res, "Se requiere idToken", 400)

        // googleLogin useCase handles creation if user doesn't exist
        const { user, token } = await authUseCases.googleRegister(idToken)
        return success(res, { user, token }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return error(res, "El email es requerido", 400)

        const result = await authUseCases.requestPasswordReset(email)
        return success(res, result)
    } catch (e) {
        return error(res, e.message, 400)
    }
}
