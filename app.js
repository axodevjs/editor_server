import express from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import corsMiddleware from './middleware/cors.middleware.js';
import documentRoutes from "./routes/documentRoutes.js";
import {Server} from "socket.io";
import inviteRoutes from "./routes/inviteRoutes.js";
// import nodemailer from 'nodemailer'
//
// // create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//     host: "smtp.mail.ru",
//     port: 465,
//     secure: true,
//     auth: {
//         user: "pomodor151@mail.ru",
//         pass: "Udc95XijqccMtQaxWSFJ",
//     },
// });
//
// transporter.sendMail({
//     from: '"Your Name" <youremail@gmail.com>', // sender address
//     to: "samoilovalex2006@gmail.com", // list of receivers
//     subject: "Medium @edigleyssonsilva ✔", // Subject line
//     text: "There is a new article. It's about sending emails, check it out!", // plain text body
//     html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
// }).then(info => {
//     console.log({info});
// }).catch(console.error);

dotenv.config();

const PORT = process.env.PORT || 6400;
const DB_URL = process.env.DB_URL;

const app = express()

app.use(corsMiddleware)
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/document', documentRoutes)
app.use('/api/invite', inviteRoutes)

async function startApp() {
    try {
        const server = await mongoose.connect(DB_URL, {useUnifiedTopology: true})
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })

        // Socket setup
        const io = await new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
    } catch (e) {
        console.log(e)
    }
}

startApp()