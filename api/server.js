import express from 'express';
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { errorMiddleware } from './middlerwares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
import path from 'path';

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:4000"],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT }`)
    })
})
.catch((err) =>{
    console.log("mongo db connection  failed !!", err)
})

// route

import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"


app.use("/api/v1/user" , userRouter)
app.use("/api/v1/auth" , authRouter)
app.use("/api/v1/post" , postRouter)
app.use("/api/v1/comment",commentRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });

app.use(errorMiddleware)
