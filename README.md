# StudyDuckBot

Twitch bot made for [Pottle](https://www.twitch.tv/pottlelive).
This bot aimed to provide multiple feature's to the stream. For now it is only a todo list bot. But I aimed to improve that in the future

## Features to do
- [X] Add a help command to display available commands
- [X] Improve task list display
- [X] Fix task scrolling
- Add confettis "!celeb" command for mods
- Add confettis stream redeem
- Add hyperfocus redeem
- Add pomo command and display:
    - manage the number of pomos to do
    - manage the number of pomos done
    - start the study timer with "!st"
    - start the break timer with "!rt"
    - add time to current timer
    - extend break redeem
    - set the timer to a certain value
    - basic display
    - enhanced display

## How does it work?
There are for different parts that constitute the bot:
- The twitch bot:  
    Reads the chat and detect the commands then call the function matching the command.

- The commands:  
    Interact with a global list of task either by adding or updating the task list. Then call the websocket function to update the list.

- The websocket & webserver:  
    Deliver the streamer interface in local and makes the bot able to interact with it.

- The streamer interface:
    A simple HTML page that displays the task list and update it when receiving new message via the websocket.

## How to use it?
Download the repo:
```
git pull https://github.com/ehrakis/StudyDuckBot
```
Inside the folder install npm dependencies:
```
npm install
```
Create an .env file with the following information:
```
CLIENT_ID={The client id of the bot twitch account}
CLIENT_SECRET={The client secret of the bot twitch account}
STREAMER_NAME={The streamer channel name where you want to use the bot}
```
Then start the bot with:
```
node ./bot.js
```


## License
[https://choosealicense.com/no-permission/](https://choosealicense.com/no-permission/)