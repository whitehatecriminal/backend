import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "50kb"})) //file limit set
app.use(express.urlencoded({extended: true, limit: "50kb"}))
app.use(express.static("public")) //use all src
app.use(cookieParser())


//routs

import userRouter from './routes/user.routs.js'

//routes declaration,or this is url
app.use("/api/v1/users", userRouter)

// http://localhost:5000/api/v1/users/register
export { app }