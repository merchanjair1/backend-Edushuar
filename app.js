const { success, error } = require("./utils/responseHandler")
const express = require("express")
require("./config/firebase")
require("dotenv").config()

const app = express()
const cors = require("cors")

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))

const apiRoutes = require("./routes/routes")
app.use("/api", apiRoutes)

app.get("/", (req, res) => {
  return success(res, { api: "online" })
})


app.use((req, res) => {
  console.log(`DEBUG: 404 - Found Route ${req.originalUrl}`)
  return error(res, "Ruta no encontrada", 404)
})

app.use((err, req, res, next) => {
  console.error("DEBUG: GLOBAL ERROR HANDLER CAUGHT:", err)
  if (err.code === "LIMIT_FILE_SIZE") {
    return error(res, "El archivo es muy grande", 400)
  }
  return error(res, err.message || "Error interno", 500)
})


module.exports = app
