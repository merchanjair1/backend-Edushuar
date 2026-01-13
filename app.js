const { success, error } = require("./utils/responseHandler")
const express = require("express")
require("./config/firebase")
require("dotenv").config()

const app = express()
const cors = require("cors")

// ⚠️ Render siempre define PORT automáticamente
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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

// Error handler
app.use((err, req, res, next) => {
  console.error("DEBUG: GLOBAL ERROR HANDLER CAUGHT:", err)
  if (err.code === "LIMIT_FILE_SIZE") {
    return error(res, "El archivo es muy grande", 400)
  }
  return error(res, err.message || "Error interno", 500)
})

// Render-compatible listen
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`)
})

module.exports = app
