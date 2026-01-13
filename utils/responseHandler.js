exports.success = (res, data = {}, status = 200) => {
  return res.status(status).json({
    code: "COD_OK",
    data
  })
}

exports.error = (res, message = "Algo salió mal", status = 500, errorObj = null) => {
  return res.status(status).json({
    code: "COD_ERROR",
    message,
    error: errorObj || message
  })
}
