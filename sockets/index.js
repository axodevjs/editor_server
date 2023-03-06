import CommitService from "../services/CommitService.js";
import DocumentService from "../services/DocumentService.js";

let channels;
channels = [];

// {
//   documentId: "documentId",
//       users: [{ userId: "someid", username: "John", editing: false }],
// },

export const initSockets = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinChannel", ({ document, user }) => {
      if (!document || !user) {
        return;
      }

      let channel = channels.find(
        (ch) => ch.documentId.toString() === document?._id.toString()
      );

      if (user?.id) {
        if (!channel) {
          channels.push({
            documentId: document?._id.toString(),
            users: [
              {
                userId: user?.id,
                username: user?.username,
                editing: false,
                socketId: socket.id,
              },
            ],
          });
        } else {
          if (!channel?.users?.find((x) => x?.userId === user?.id)) {
            channel?.users?.push({
              userId: user?.id,
              username: user?.username,
              editing: false,
              socketId: socket.id,
            });
          }
        }

        socket.join(document?._id);
        io.in(document?._id).emit("updateChannel", channel);

        console.log(channels);
      }
    });

    socket.on("startEdit", ({ document, user }) => {
      if (!document || !user) {
        return;
      }

      let channel = channels.find(
        (ch) => ch.documentId.toString() === document?._id.toString()
      );

      if (!channel) {
        return;
      }

      let userIndex = channel?.users?.findIndex((x) => x?.userId === user?.id);
      if (channel?.users[userIndex]) {
        channel.users[userIndex].editing = true;
      }

      io.in(document?._id).emit("updateChannel", channel);
    });

    socket.on("stopEdit", ({ document, user }) => {
      if (!document || !user) {
        return;
      }

      let channel = channels.find(
        (ch) => ch.documentId.toString() === document?._id.toString()
      );

      if (!channel) {
        return;
      }

      let userIndex = channel?.users?.findIndex((x) => x?.userId === user?.id);
      if (channel?.users[userIndex]) {
        channel.users[userIndex].editing = false;
      }

      io.in(document?._id).emit("updateChannel", channel);
    });

    socket.on("sendEdit", ({ document, user, newContent }) => {
      if (!document || !user) {
        return;
      }

      let channel = channels.find(
        (ch) => ch.documentId.toString() === document?._id.toString()
      );

      if (!channel) {
        return;
      }

      CommitService.createCommit({
        documentId: document?._id,
        before: document?.content,
        after: newContent,
        date: new Date(),
        status: channel?.users?.length === 1 ? "accepted" : "waiting",
        username: user?.username,
        userId: user?.id,
        votesAccept: [],
        votesReject: [],
      }).then((commit) => {
        console.log(commit);
        io.in(document?._id).emit("commitCreate", commit);
      });
    });

    socket.on("actionCommit", ({ document, user, commit, type }) => {
      if (!document || !user) {
        return;
      }

      let channel = channels.find(
        (ch) => ch.documentId.toString() === document?._id.toString()
      );

      if (!channel) {
        return;
      }

      CommitService.getOne(commit?._id).then((response) => {
        let newCommit = response;

        if (type === "accept") {
          if (
            !newCommit?.votesAccept?.find((x) => x?.userId === user?.id) &&
            !newCommit?.votesReject?.find((x) => x?.userId === user?.id)
          ) {
            newCommit.votesAccept?.push({
              userId: user?.id,
              username: user?.username,
            });
          }
        }
        if (type === "reject") {
          if (
            !newCommit?.votesReject?.find((x) => x?.userId === user?.id) &&
            !newCommit?.votesAccept?.find((x) => x?.userId === user?.id)
          ) {
            newCommit.votesReject?.push({
              userId: user?.id,
              username: user?.username,
            });
          }
        }

        let acceptCount = newCommit?.votesAccept?.length;
        let rejectCount = newCommit?.votesReject?.length;
        let newDocument = undefined;

        if (acceptCount + rejectCount === document?.users?.length) {
          if (acceptCount > rejectCount) {
            newCommit.status = "accepted";

            newDocument = document;
            newDocument.content = newCommit?.after;
            DocumentService?.update(document?._id, newDocument);
          }
          if (rejectCount > acceptCount) {
            newCommit.status = "rejected";
          }
          if (rejectCount === acceptCount) {
            newCommit.status = "rejected";
          }
        }

        CommitService.update(commit?._id, newCommit).then((commit) => {
          CommitService.getAllByDocumentId(document?._id).then((response) =>
            io
              .in(document?._id)
              .emit("commitUpdate", { commits: response, newDocument })
          );
        });
      });
    });

    socket.on("disconnect", () => {
      let channel = channels.find((x) =>
        x.users.find((a) => a.socketId === socket.id)
      );
      console.log("disconnect");
      if (channel) {
        channel.users = channel.users.filter((x) => x.socketId !== socket.id);

        console.log(JSON.stringify(channel));
        io.in(channel?.documentId).emit("userLeft", channel);

        if (!channel.users?.length) {
          channels.splice(channels.indexOf(channel), 1);
        }
      }
    });
  });
};
