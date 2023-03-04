import Document from "../models/Document.js";

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
    const document = await Document.find({userId: id});
    return document;
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
}

export default new DocumentService();
