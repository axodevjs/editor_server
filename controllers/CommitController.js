import CommitService from "../services/CommitService.js";

class CommitController {
  async create(req, res) {
    try {
      const commit = await CommitService.createCommit(req.body);
      return res.json(commit);
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }

  async getOne(req, res) {
    try {
      const commit = await CommitService.getOne(req.params.id);
      return res.json(commit);
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }

  async getAllByDocumentId(req, res) {
    try {
      const commits = await CommitService.getAllByDocumentId(req.params.id);
      return res.json(commits);
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }

  async update(req, res) {
    try {
      const commit = await CommitService.update(req.params.id, req.body);
      return res.json(commit);
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }
}

export default new CommitController();
