export const todolist = [];

function getUndoneTaskForUser(username) {
  return todolist.filter((todo) => {
    if (todo.username === username && !todo.isDone) return todo;
  });
}

export function createTodo(target, username, msg, client) {
  const task = getUndoneTaskForUser(username);
  if (task.length > 0 && msg.length > 0) {
    client.say(
      target,
      `${username} You already have a task: "${task[0].todo}" type !edit (task) to update it or !done to complete it.`
    );
  } else if (task.length > 0 && msg.length === 0) {
    client.say(
      target,
      `${username} You current task is: "${task[0].todo}" type !edit (task) to update it or !done to complete it.`
    );
  } else if (task.length === 0 && msg.length > 0) {
    todolist.push({
      username: username,
      todo: msg,
      isDone: false,
    });
    client.say(
      target,
      `${username} Your task "${msg}" has been added to the list!`
    );
  } else {
    todohelp(target, username, client);
  }
}

export function completeTask(target, username, client) {
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

export function edit(target, username, msg, client) {
  const task = getUndoneTaskForUser(username);
  if (task.length === 0) {
    client.say(
      target,
      `${username} You don't have any active task. Type !todo (task) to add one to the list.`
    );
  } else {
    task[0].todo = msg;
    client.say(target, `${username} Your task was updated to "${task[0].todo}".`);
  }
}

export function todohelp(target, username, client) {
  client.say(
    target,
    `${username}, Commands: !todo (task) to add a task, !done to complete a task, !edit (task) to edit a task.`
  );
}
