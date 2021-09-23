const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("#roomname");
const nameForm = document.getElementById("nickname");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const msg = input.value;
  socket.emit("new_message", msg, roomName, () => {
    addMessage(`You: ${msg}`);
  });
  input.value = "";
};

const paintRoomTitle = (count) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;
};

const showRoom = (newCount) => {
  welcome.hidden = true;
  room.hidden = false;
  paintRoomTitle(newCount);
  const messageForm = room.querySelector("#msg");
  messageForm.addEventListener("submit", handleMessageSubmit);
};

const handleSubmit = (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

const handleNicknameSubmit = (e) => {
  e.preventDefault();
  nameForm.hidden = true;
  const input = nameForm.querySelector("input");
  socket.emit("nickname", input.value);
};

form.addEventListener("submit", handleSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user, newCount) => {
  paintRoomTitle(newCount);
  addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
  paintRoomTitle(newCount);
  addMessage(`${left} left👋`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("#roomList");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
