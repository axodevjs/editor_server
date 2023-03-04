import Document from "../models/Document.js";
import User from "../models/User.js";
import mongoose from "mongoose";

class DocumentService {
    async create(document) {
        const createdDocument = await Document.create(document);
        return createdDocument;
    }

    async getOne(id) {
        const document = await Document.findById(id);
        return document;
    }

    async getAllByUserId(id) {
        const user = await User.findById(id);
        return user.documents;
    }

    async update(id, body) {
        const document = await Document.findOneAndUpdate({_id: id}, body, {
            new: true
        });
        return document;
    }

    async delete(id) {
        const document = await Document.deleteOne({_id: id});
        return document;
    }

    async addUser(id, email, role) {
        const candidate = await User.findOne({email})
        const document = await Document.findById(id)

        // Если уже зарегистрирован
        if (candidate) {
            
        }

        // Создание аккаунта
        else {
            const username = email.split('@')[0]
            const password = Math.random().toString(36).substr(2, 8)

            // TODO: отправить на почту сообщение с ссылкой для входа

            const user = await User.create({
                email,
                username,
                password,
                online: false,
                documents: [{
                    documentId: id,
                    role,
                    title: document?.title
                }]
            })
            return user;
        }
    }
}

export default new DocumentService();
