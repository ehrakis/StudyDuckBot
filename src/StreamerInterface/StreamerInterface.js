import { WebSocketServer } from 'ws';
import express from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import { todolist } from '../todolist.js';


const app = express();
const sockserver = new WebSocketServer({ port: 8000 })
//----------------------- Web server ----------------------
function startWebServer() {
    const port = 80;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../../index.html'));
    });

    app.listen(port);
    console.log('Server started at http://localhost:' + port);
}

//----------------------- Web socket ----------------------
function startWebSocket() {
    sockserver.on('connection', ws => {
        ws.send(JSON.stringify(todolist))
        ws.onerror = function () {
          console.log('websocket error')
        }
    })
}

export function sendList(){
    sockserver.clients.forEach((client) => {
        client.send(JSON.stringify(todolist))
    })
}

export function initializaStreamInterface(){
    startWebServer();
    startWebSocket();
}