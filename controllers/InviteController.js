import Invite from "../models/Invite.js";
import Document from "../models/Document.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, secure: true, auth: {
        user: process.env.SMTP_USER, pass: process.env.SMTP_PASS,
    },
});

class InviteController {
    async create(req, res) {
        try {
            const {documentId, role, email} = req.body

            const invite = await Invite.create({documentId, role, email})

            /**
             * Отправка письма на email с ссылкой для регистрации в документе
             */
            // send email
            await transporter.sendMail({
                from: '"Administration" <molodoybudido@yandex.ru>', // sender address
                to: email, // list of receivers
                subject: "Вас пригласили в документ!", // Subject line
                text: `Приглашение`, // plain text body
                html: `<b>Ссылка: ${process.env.CLIENT_URL}/invites/${invite?._id}</b>`, // html body
            }).then(info => {
                console.log({info});
            }).catch(console.error);

            return res.json(invite)
        } catch (e) {
            console.log(e)
            return res.send({message: "Server error"})
        }
    }

    async use(req, res) {
        try {
            let foundInvite = await Invite.findById(req.params.id)

            if (!foundInvite) {
                return res.status(404).send({message: "Not found"})
            }

            let foundDoc = await Document.findOne({_id: foundInvite?.documentId.toString()})
            if (!foundDoc) {
                return res.status(404).send({message: "Not found doc"})
            }

            // await Invite.deleteOne({_id: req.params.id})

            // registration in users
            let username = Math.random().toString(36).slice(-8);
            let password = Math.random().toString(36).slice(-8);

            let alreadyReg = false;

            let candidateEmail = await User.findOne({email: foundInvite?.email})
            let user;
            if (candidateEmail) {console.log("already have")
                if (!candidateEmail?.documents?.find(x => x?.documentId === foundDoc?._id)) {console.log("update")
                    candidateEmail?.documents?.push({documentId: foundDoc?._id, role: foundInvite?.role, title: foundInvite?.title})
                    user = await User.findOneAndUpdate({email: foundInvite?.email}, candidateEmail, {new: true})
                }
                alreadyReg = true

                foundDoc?.users.push({role: foundInvite?.role, userId: candidateEmail._id, username: candidateEmail?.username})
            }

            if (!alreadyReg) {
                const hashPassword = await bcrypt.hash(password, 8)
                user = await new User({username, password: hashPassword, email: foundInvite?.email, documents: [{documentId: foundDoc?._id, role: foundInvite?.role, title: foundInvite?.title}]})
                await user.save()

                foundDoc?.users.push({role: foundInvite?.role, userId: user._id, username})
            }



            const document = await Document.findOneAndUpdate({_id: foundInvite?.documentId.toString()}, foundDoc, {
                new: true
            });

            // create reusable transporter object using the default SMTP transport
            const transporter = await nodemailer.createTransport({
                host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, secure: true, auth: {
                    user: process.env.SMTP_USER, pass: process.env.SMTP_PASS,
                },
            });

            if (!alreadyReg) {
                // send email
                await transporter.sendMail({
                    from: '"Administration" <molodoybudido@yandex.ru>', // sender address
                    to: foundInvite?.email, // list of receivers
                    subject: "Вы успешно зарегистрировались!", // Subject line
                    text: `Мы сгенерировали данные для входа`, // plain text body
                    html: `<b>Ваш логин: ${username} <br> Ваш пароль: ${password} <br> Для открытия документа зайдите по ссылке: <a href="${process.env.CLIENT_URL}/editor/${foundDoc._id}">${process.env.CLIENT_URL}/editor/${foundDoc._id}</a></b>`, // html body
                }).then(info => {
                    console.log({info});
                }).catch(console.error);
            }

            // если уже зареган
            else {
                await transporter.sendMail({
                    from: '"Administration" <molodoybudido@yandex.ru>', // sender address
                    to: foundInvite?.email, // list of receivers
                    subject: "Вы успешно присоединились к документу!", // Subject line
                    text: `Вы участник документа`, // plain text body
                    html: `<b>Для открытия документа зайдите по ссылке: <a href="${process.env.CLIENT_URL}/editor/${foundDoc._id}">${process.env.CLIENT_URL}/editor/${foundDoc._id}</a></b>`, // html body
                }).then(info => {
                    console.log({info});
                }).catch(console.error);
            }

            const token = jwt.sign({id: user.id}, process.env.secretKey, {expiresIn: "1h"})

            return res.json({
                token, user: {
                    id: user.id, username: user.username
                }, document
            })


        } catch (e) {
            console.log(e)
            return res.send({message: "Server error"})
        }
    }
}

export default new InviteController()