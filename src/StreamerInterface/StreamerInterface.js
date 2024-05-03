import { WebSocketServer } from "ws";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { getList } from "../widgets/todolist.js";

const app = express();
const sockserver = new WebSocketServer({ port: 8000 });
//----------------------- Web server ----------------------
function startWebServer() {
  const port = 80;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./web-pages/index.html"));
  });
  app.get("/style.css", function (req, res) {
    res.sendFile(path.join(__dirname, "./web-pages/style.css"));
  });
  app.get("/script.js", function (req, res) {
    res.sendFile(path.join(__dirname, "./web-pages/script.js"));
  });

  app.listen(port);
  console.log(`Server started at http://localhost:${port}`); // eslint-disable-line no-console
}

//----------------------- Web socket ----------------------
function startWebSocket() {
  sockserver.on("connection", (ws) => {
    ws.send(JSON.stringify(getList())); // Initiate todolist on page load
    ws.onerror = function () {
      console.log("websocket error"); // eslint-disable-line no-console
    };
  });
}

export function sendAction(action) {
  sockserver.clients.forEach((client) => {
    client.send(JSON.stringify(action));
  });
}

export function initializaStreamInterface() {
  startWebServer();
  startWebSocket();
}
