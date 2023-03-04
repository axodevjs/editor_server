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
      const document = await DocumentService.getAllByUserId(req.params.userId);

      return document
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAllByUserId(req, res) {
    try {
      const documents = await DocumentService.getAllByUserId(req.params.userId);

      return res.json(documents);
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

  async addUser(req, res) {
    const {email, role} = req.body;

    if (!email) {
      return res.status(500).json({message: "Введите email"})
    }
    if (!role) {
      return res.status(500).json({message: "Введите роль"})
    }

    const document = await DocumentService.addUser(req.params.id, email, role);
    return res.json(document);
  }
}

export default new DocumentController();
