exports.success = (res, data = {}, status = 200) => {
  return res.status(status).json({
    ok: true,
    data
  })
}

exports.error = (res, message = "Algo salió mal", status = 500) => {
  return res.status(status).json({
    ok: false,
    error: message
  })
}
