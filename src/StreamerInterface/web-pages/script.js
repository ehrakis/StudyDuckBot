const wss = new WebSocket(`ws://localhost:8000`);
let todoList = [];
let needToCheckSize = true;

let carouselSlider = document.querySelector(".carousel__slider");
let list = document.querySelector(".carousel__list");
let list2;

const speed = 0.5;
const gap = parseInt(
  window
    .getComputedStyle(document.querySelector(".carousel__list"))
    .getPropertyValue("gap")
);
let height = list.scrollHeight + gap;
let y = 0;
let y2 = height;

wss.onmessage = function (e) {
  const data = JSON.parse(e.data);
  updateTodolist(data);
};

function updateTodolist(data) {
  todoList = data.reverse();

  let tasks = data.map((todo) => {
    const checked = todo.isDone ? " checked" : "";
    return `<li class="carousel__item"><span class="username${checked}"><input type="checkbox"${checked}/>${todo.username}</span><p>${todo.todo}</p></li>`;
  });
  const currentListLength =
    document.querySelector(".carousel__list").scrollHeight + gap;
  Array.from(document.getElementsByClassName("carousel__list")).forEach(
    (element) => {
      element.innerHTML = tasks.join("");
    }
  );
  updateListHeight(currentListLength);
  if (needToCheckSize) checkSize();
}

function clone() {
  list2 = list.cloneNode(true);
  carouselSlider.appendChild(list2);
  list2.style.top = `${height}px`;
}

function moveFirst() {
  y -= speed;

  if (height >= Math.abs(y)) {
    list.style.top = `${y}px`;
  } else {
    y = height;
  }
}

function moveSecond() {
  y2 -= speed;

  if (height >= Math.abs(y2)) {
    list2.style.top = `${y2}px`;
  } else {
    y2 = height;
  }
}

function checkSize() {
  if (
    document.querySelector(".carousel__list").scrollHeight >
    document.querySelector(".carousel__slider").offsetHeight
  ) {
    clone();
    let a = setInterval(moveFirst, 10);
    let b = setInterval(moveSecond, 10);
    needToCheckSize = false;
  }
}

function updateListHeight(currentListLength) {
  height = document.querySelector(".carousel__list").scrollHeight + gap;
  difference = height - currentListLength;
  if (difference <= 0) {
    return;
  }
  if (y < y2) {
    y -= difference;
  } else {
    y2 -= difference;
  }
}