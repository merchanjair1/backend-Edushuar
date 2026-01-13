const express = require("express")
require("./config/firebase")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const userRoutes = require("./routes/routes")
app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
  res.json({ api: "online" })
})


// 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Error interno" })
})

app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`))
module.exports = app