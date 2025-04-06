const userList = new Map();

export class SocketServerConnection {
  constructor(instance) {
    this.instance = instance;
    instance.on("connection", (socket) => {
      console.log("new client is connectdd");
      const userId = socket.handshake.query.id;
      if (userId) {
        userList.set(userId, socket.id);
      } else {
        console.error("Client did not send an id in the query.");
      }

      socket.on("message", (payload) => {
        const { receiver, message } = JSON.parse(payload);
        socket.to(userList.get(receiver.toString())).emit("message", message);
      });
    });

    instance.on("disconnect", () => {
      userList.delete(userId);
    });
  }

  static sendMessageViaSocket(receiver, message,event="message") {
    this.instance.to(userList.get(receiver)).emit(event, { message });
  }
}
