import Commit from "../models/Commit.js";

class CommitService {
  async createCommit(body) {
    const commit = await Commit.create(body);

    return commit;
  }

  async getOne(id) {
    const commit = await Commit.findOne({ _id: id });

    return commit;
  }

  async getAllByDocumentId(id) {
    const commits = await Commit.find({ documentId: id });
    return commits;
  }

  async update(id, newDoc) {
    const commit = await Commit.findOneAndUpdate({ _id: id }, newDoc, {
      new: true,
    });
    return commit;
  }
}

export default new CommitService();
