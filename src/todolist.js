export const todolist = [];

function getUndoneTaskForUser(target) {
  return todolist.filter((todo) => {
    if (todo.username === target && !todo.isDone) return todo;
  });
}

export function createTodo(target, msg, client) {
  const task = getUndoneTaskForUser(target);
  if (task.length > 0 && msg.length > 0) {
    client.say(
      target,
      `${target} You already have a task: "${task[0].todo}" type !edit (task) to update it or !done to complete it.`
    );
  } else if (task.length > 0 && msg.length === 0) {
    client.say(
      target,
      `${target} You current task is: "${task[0].todo}" type !edit (task) to update it or !done to complete it.`
    );
  } else if (task.length === 0 && msg.length > 0) {
    todolist.push({
      username: target,
      todo: msg,
      isDone: false,
    });
    client.say(
      target,
      `${target} Your task "${msg}" has been added to the list!`
    );
  } else {
    todohelp(target);
  }
}

export function completeTask(target, msg, client) {
  const task = getUndoneTaskForUser(target);
  if (task.length === 0) {
    client.say(
      target,
      `${target} You don't have any active task. Type !todo (task) to add one to the list.`
    );
  } else {
    task[0].isDone = true;
    client.say(
      target,
      `${target} Slaaaaayyy! You completed your task "${task[0].todo}"!`
    );
  }
}

export function edit(target, msg, client) {
  const task = getUndoneTaskForUser(target);
  if (task.length === 0) {
    client.say(
      target,
      `${target} You don't have any active task. Type !todo (task) to add one to the list.`
    );
  } else {
    task[0].todo = msg;
    client.say(target, `${target} Your task was updated to "${task[0].todo}".`);
  }
}

export function todohelp(target, client) {
  client.say(
    target,
    "Commands: !todo (task) to add a task, !done to complete a task, !edit (task) to edit a task."
  );
}
