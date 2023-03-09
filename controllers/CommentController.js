import CommentService from "../services/CommentService.js";

class CommitController {
  async create(req, res) {
    try {
      const commit = await CommentService.createComment(req.body);
      return res.json(commit);
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }

  async getAllByCommitId(req, res) {
    try {
      const commits = await CommentService.getAllByCommitId(req.params.id);
      return res.json(commits);
    } catch (e) {
      console.log(e);
      return res.send({ message: "Server error" });
    }
  }
}

export default new CommitController();
