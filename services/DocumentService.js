import Document from "../models/Document.js";
import User from "../models/User.js";
import { sendEmailMessage } from "../controllers/EmailController.js";
import bcrypt from "bcrypt";

class DocumentService {
  async create(document) {
    const createdDocument = await Document.create(document);
    let user = await User.findOne({ _id: document?.users[0]?.userId });

    user.documents.push({
      documentId: createdDocument?._id,
      role: document?.users[0]?.role,
      title: document?.title,
    });

    await User.findOneAndUpdate({ _id: user._id }, user, {
      new: true,
    });

    return createdDocument;
  }

  async getOne(id, userId) {
    const document = await Document.findOne({ _id: id });

    console.log(id);
    console.log(document.users);
    console.log(userId?.toString());
    if (
      !document?.users?.find(
        (x) => x?.userId?.toString() === userId?.toString()
      )
    ) {
      console.log("null");
      return null;
    }

    return document;
  }

  async getAllByUserId(id) {
    const user = await User.findById(id);
    console.log(user);
    console.log(user.documents);
    return user.documents;
  }

  async update(id, body) {
    const document = await Document.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    return document;
  }

  async delete(id) {
    const document = await Document.deleteOne({ _id: id });
    return document;
  }

  async addUser(id, email, role) {
    let candidate = await User.findOne({ email });
    let document = await Document.findById(id);

    // Если уже зарегистрирован
    if (candidate) {
      // добавление пользователя в документ

      if (
        !document?.users?.find(
          (x) => x.userId.toString() === candidate?.id.toString()
        )
      ) {
        document.users.push({
          role,
          userId: candidate?._id,
          username: candidate?.username,
          email: candidate?.email,
        });

        await Document.findOneAndUpdate({ _id: id }, document, { new: true });
      }

      // добавление документа к пользователю
      if (
        !candidate.documents?.find(
          (x) => x.documentId.toString() === id.toString()
        )
      ) {
        candidate.documents.push({
          documentId: id,
          role,
          title: document.title,
        });

        await User.findOneAndUpdate({ _id: candidate._id }, candidate, {
          new: true,
        });
      }

      await sendEmailMessage(
        email,
        "Вы добавлены в документ",
        `Для открытия войдите в аккаунт по ссылке ниже
                Ссылка: ${process.env.CLIENT_URL}
`
      );

      return document;
    }

    // Создание аккаунта
    else {
      const username = email.split("@")[0];
      const password = Math.random().toString(36).substr(2, 8);
      const hashPassword = await bcrypt.hash(password, 8);

      // TODO: отправить на почту сообщение с ссылкой для входа

      const user = await User.create({
        email,
        username,
        password: hashPassword,
        online: false,
        documents: [
          {
            documentId: id,
            role,
            title: document?.title,
          },
        ],
      });

      // добавление пользователя в документ
      if (
        !document?.users?.find(
          (x) => x.userId.toString() === user?._id.toString()
        )
      ) {
        document?.users?.push({
          role,
          userId: user?._id,
          username,
          email,
        });

        await Document.findOneAndUpdate({ _id: id }, document, { new: true });
      }

      await sendEmailMessage(
        email,
        "Вы добавлены в документ",
        `Вас пригласили в документ ${document?.title}. Для открытия войдите в аккаунт
                Логин: ${username}
                Пароль: ${password}
                Ссылка: ${process.env.CLIENT_URL}
`
      );

      return user;
    }
  }
}

export default new DocumentService();
