import DocumentService from "../services/DocumentService.js";
import jwt from "jsonwebtoken";


class DocumentController {
  async create(req, res) {
    try {
      const document = await DocumentService.create(req.body);
      res.json(document);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getOne(req, res) {
    try {
      const document = await DocumentService.getOne(req.params.id);

      // Проверка является ли пользователь владельцем документа
      // const token = req.headers.authorization.split(' ')[1]
      // if (!token) {
      //   return res.status(401).json({message: 'Auth error'})
      // }
      // req.user = jwt.verify(token, process.env.secretKey)
      // if (req.user?.id !== document?.userId.toString()) {
      //   return res.status(401).json({message: 'Auth error'})
      // }

      return res.json(document);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAllByUserId(req, res) {
    try {
      const document = await DocumentService.getAllByUserId(req.params.userId);

      return res.json(document);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const document = await DocumentService.update(req.params.id, req.body);
      return res.json(document);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async delete(req, res) {
    try {
      const document = await DocumentService.delete(req.params.id);
      return res.json(document);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default new DocumentController();