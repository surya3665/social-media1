const express = require("express")
const cors = require("cors")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const apiRouter = require("./routes")
const connectDB = require("./config/db")
const {v2:cloud} = require("cloudinary")

const app = express()
connectDB()
cloud.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})
const PORT = process.env.PORT || 4000
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  };
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: true}))
app.use("/api", apiRouter)


app.listen(PORT, () => {
    console.log("server was started on "+PORT)
})