const errorMessages = {
    // Model specific errors
    "DictionaryWord constructor: Invalid data": "Los datos de la palabra son inválidos.",
    "Contribution constructor: Invalid data": "Los datos de la contribución son inválidos.",

    // Use Case specific errors
    "Missing required fields: userId, type, content": "Faltan campos obligatorios: usuario, tipo o contenido.",
    "Contribution not found": "La contribución no existe o no pudo ser encontrada.",
    "Contribution is already approved": "Esta contribución ya ha sido aprobada.",
    "Contribution is already rejected": "Esta contribución ya ha sido rechazada.",
    "Invalid contribution type": "Tipo de contribución no válido.",
    "Palabra no encontrada": "La palabra solicitada no existe.",
    "Contribución no encontrada": "La contribución solicitada no existe.",
    "Usuario no encontrado": "El usuario solicitado no existe.",
    "Cuento no encontrado": "El cuento solicitado no existe.",
    "Lección no encontrada": "La lección solicitada no existe.",

    // General errors
    "Ruta no encontrada": "La ruta solicitada no se encuentra disponible.",
    "Internal server error": "Ha ocurrido un error interno en el servidor. Por favor, inténtelo de nuevo más tarde.",
    "Unauthorized": "No tiene permisos para realizar esta acción.",
    "documentPath": "El identificador proporcionado no es válido o está vacío.",
    "Value for argument": "Se recibió un dato inválido. Por favor, verifique los campos."
};

/**
 * Maps technical error messages to user-friendly ones.
 * @param {string} technicalMessage 
 * @returns {string} User-friendly message
 */
exports.mapError = (technicalMessage) => {
    // Ensure we are working with a string
    let msg = technicalMessage;
    if (typeof technicalMessage !== "string") {
        msg = technicalMessage?.message || JSON.stringify(technicalMessage) || "";
    }

    if (!msg) return "Algo salió mal";

    // Basic lookup
    if (errorMessages[msg]) {
        return errorMessages[msg];
    }

    // Substring match for dynamic messages
    for (const [key, value] of Object.entries(errorMessages)) {
        if (msg.includes(key)) {
            return value;
        }
    }

    // Default message if no match
    return msg;
};
