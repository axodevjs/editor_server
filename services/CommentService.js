import Comment from "../models/Comment.js";

class CommentService {
  async createComment(body) {
    const comment = await Comment.create(body);

    return comment;
  }

  async getAllByCommitId(id) {
    const comments = await Comment.find({ commitId: id });
    return comments;
  }
}

export default new CommentService();
