import * as fs from "node:fs/promises";
import * as tmi from "@twurple/auth-tmi";
import { RefreshingAuthProvider } from "@twurple/auth";
import { createTodo, completeTask, edit, todohelp } from "../todolist.js";
import { sendList } from "../StreamerInterface/StreamerInterface.js";
import * as dotenv from "dotenv";
dotenv.config();

// ----------------------- Twitch connection --------------------------
const tokenData = JSON.parse(await fs.readFile("./auth.json", "UTF-8"));
const authProvider = new RefreshingAuthProvider({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

authProvider.onRefresh(
  async (userId, newTokenData) =>
    await fs.writeFile(
      "./auth.json",
      JSON.stringify(newTokenData, null, 4),
      "UTF-8"
    )
);

await authProvider.addUserForToken(tokenData, ["chat"]);

const opts = {
  options: { debug: false, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true,
  },
  authProvider: authProvider,
  channels: [process.env.STREAMER_NAME],
};

// Create a client with our options
export const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`); // eslint-disable-line no-console
}

// -------------------------- TODO List command ----------------------
// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot
  if (msg[0] !== "!") {
    return;
  } // Ignore message that doesn't start with !

  // Remove whitespace from chat message
  const commandName = msg.trim().split(" ")[0];
  const message = msg.trim().split(" ").slice(1).join(" ");
  const username = context.username;

  // If the command is known, let's execute it
  if (commandName === "!todo") {
    createTodo(target, username, message, client);
    sendList();
  } else if (commandName === "!done") {
    completeTask(target, username, client);
    sendList();
  } else if (commandName === "!edit") {
    edit(target, username, message, client);
    sendList();
  } else if (commandName === "!todohelp") {
    todohelp(target, username, client);
  }
}
