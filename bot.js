import * as fs from 'node:fs/promises';
import * as tmi from '@twurple/auth-tmi';
import { RefreshingAuthProvider } from '@twurple/auth';
import { WebSocketServer } from 'ws';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const todolist = []

//----------------------- Web server ----------------------
const app = express();
const port = 80;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.listen(port);
console.log('Server started at http://localhost:' + port);

//----------------------- Web socket ----------------------
const sockserver = new WebSocketServer({ port: 8000 })
sockserver.on('connection', ws => {
 ws.send(JSON.stringify(todolist))
 ws.onerror = function () {
   console.log('websocket error')
 }
})

// ----------------------- Twitch connection --------------------------
const tokenData = JSON.parse(await fs.readFile('./auth.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    }
);

authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./auth.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));

await authProvider.addUserForToken(tokenData, ['chat']);

const opts = {
    options: { debug: false, messagesLogLevel: 'info' },
    connection: {
        reconnect: true,
        secure: true
    },
    authProvider: authProvider,
    channels: [
        process.env.STREAMER_NAME,
    ]
}

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();


// -------------------------- TODO List command ----------------------
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    if (msg[0] !== "!") { return; } // Ignore message that doesn't start with !

    // Remove whitespace from chat message
    const commandName = msg.trim().split(" ")[0];
    const message = msg.trim().split(" ").slice(1).join(" ")
    const username = target.slice(1)

    // If the command is known, let's execute it
    if (commandName === '!todo' && message.length > 0) {
        createTodo(username, message);
        sendList()
    } else if (commandName === '!done') {
        completeTask(username, message);
        sendList()
    } else if (commandName === '!edit') {
        edit(username, message);
        sendList()
    } else if (commandName === '!todohelp') {
        client.say(target, `Commands: !todo (task) to add a task, !done to complete a task, !edit (task) to edit a task.`);
    } else {
        console.log(`* Unknown command ${commandName}`);
    }
}

function sendList(){
    sockserver.clients.forEach((client) => {
        client.send(JSON.stringify(todolist))
    })
}

function getUndoneTaskForUser(target){
    return todolist.filter((todo) => {
        if (todo.username === target && !todo.isDone)
            return todo;
    })
}

function createTodo(target, msg){
    const task = getUndoneTaskForUser(target);
    if (task.length > 0) {
        client.say(target, `${target} You already have a task: "${task[0].todo}" type !edit (task) to update it or !done to complete it.`);
    } else {
        todolist.push(
            {
                "username": target,
                "todo": msg,
                "isDone": false
            }
        )
        client.say(target, `${target} Your task "${msg}" has been added to the list!`);
    }
}

function completeTask(target, msg){
    const task = getUndoneTaskForUser(target)
    if (task.length === 0) {
        client.say(target, `${target} You don't have any active task. Type !todo (task) to add one to the list.`);
    } else {
        task[0].isDone = true;
        client.say(target, `${target} Slaaaaayyy! You completed your task "${task[0].todo}"!`);
    }
}

function edit(target, msg){
    const task = getUndoneTaskForUser(target)
    if (task.length === 0) {
        client.say(target, `${target} You don't have any active task. Type !todo (task) to add one to the list.`);
    } else {
        task[0].todo = msg;
        client.say(target, `${target} Your task was updated to "${task[0].todo}".`);
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

