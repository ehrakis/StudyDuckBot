export const todolist = [];

function getUndoneTaskForUser(username) {
  return todolist.filter((todo) => {
    if (todo.username === username && !todo.isDone) return todo;
  });
}

export function createTodo(target, username, message, client) {
  const task = getUndoneTaskForUser(username);
  if (task.length > 0 && message.length > 0) {
    client.say(
      target,
      `${username} You already have a task: "${task[0].todo}" type !edit (task) to update it or !done to complete it.`
    );
  } else if (task.length > 0 && message.length === 0) {
    client.say(
      target,
      `${username} You current task is: "${task[0].todo}" type !edit (task) to update it or !done to complete it.`
    );
  } else if (task.length === 0 && message.length > 0) {
    todolist.push({
      username: username,
      todo: message,
      isDone: false,
    });
    client.say(
      target,
      `${username} Your task "${message}" has been added to the list!`
    );
  } else {
    todohelp(target, username, client);
  }
}

export function completeTask(target, username, _, client) {
  const task = getUndoneTaskForUser(username);
  if (task.length === 0) {
    client.say(
      target,
      `${username} You don't have any active task. Type !todo (task) to add one to the list.`
    );
  } else {
    task[0].isDone = true;
    client.say(
      target,
      `${username} Slaaaaayyy! You completed your task "${task[0].todo}"!`
    );
  }
}

export function edit(target, username, message, client) {
  const task = getUndoneTaskForUser(username);
  if (task.length === 0) {
    client.say(
      target,
      `${username} You don't have any active task. Type !todo (task) to add one to the list.`
    );
  } else {
    task[0].todo = message;
    client.say(target, `${username} Your task was updated to "${task[0].todo}".`);
  }
}

export function todohelp(target, username, _, client) {
  client.say(
    target,
    `${username}, Commands: !todo (task) to add a task, !done to complete a task, !edit (task) to edit a task.`
  );
}

export function getList() {
  return {
    type: "todolist",
    data: todolist,
  }
}

export function getTodoListCommands(){
  return {
    "!todo": function (target, username, message, client) {
      createTodo(target, username, message, client);
      return getList();
    },
    "!done": function (target, username, message, client) {
      completeTask(target, username, message, client);
      return getList();
    },
    "!edit": function (target, username, message, client) {
      edit(target, username, message, client);
      return getList();
    },
    "!todohelp": function (target, username, message, client) {
      todohelp(target, username, message, client);
      return null;
    },
  }
}