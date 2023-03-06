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
      channel.users[userIndex].editing = true;

      io.in(document?._id).emit("updateChannel", channel);
    });

    socket.on("sendEdit", ({ document, user }) => {
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
      channel.users[userIndex].editing = true;

      io.in(document?._id).emit("updateChannel", channel);
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
