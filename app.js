const { success, error } = require("./utils/responseHandler")
const express = require("express")
require("./config/firebase")
require("dotenv").config()

const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 4000

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// DEBUG: Middleware to log all requests - REMOVED
// app.use((req, res, next) ...)

const userRoutes = require("./routes/routes")
app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
  return success(res, { api: "online" })
})


// 404
app.use((req, res) => {
  console.log(`DEBUG: 404 - Found Route ${req.originalUrl}`)
  return error(res, "Ruta no encontrada", 404)
})

app.use((err, req, res, next) => {
  console.error("DEBUG: GLOBAL ERROR HANDLER CAUGHT:", err)
  // Check if it's a multer error
  if (err.code === "LIMIT_FILE_SIZE") {
    return error(res, "El archivo es muy grande", 400)
  }
  return error(res, err.message || "Error interno", 500)
})

app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`))
module.exports = app