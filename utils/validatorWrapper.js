const { error } = require("./responseHandler")

/**
 * Middleware to validate required fields in req.body
 * @param {Array} fields - List of required field names (strings)
 * @param {Boolean} requireFile - If true, requires req.file to be present
 */
exports.validate = (fields = [], requireFile = false) => {
    return (req, res, next) => {
        const missing = []

        // Check Body Fields
        fields.forEach(field => {
            // Check if field is missing or empty string
            if (!req.body[field] || req.body[field].toString().trim() === "") {
                missing.push(field)
            }
        })

        // Check File if required
        if (requireFile && !req.file) {
            missing.push("file (photo/image)")
        }

        if (missing.length > 0) {
            return error(res, `Faltan campos obligatorios: ${missing.join(", ")}`, 400, "MISSING_FIELDS")
        }

        next()
    }
}
