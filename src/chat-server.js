import { WebSocketServer, WebSocket } from "ws";
import axios from "axios";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.on("message", function message(data, isBinary) {
    axios.post("http://localhost:3000/messages", { data: data.toString() });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

console.log("Server running...");
