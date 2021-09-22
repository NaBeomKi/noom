const messageList = document.querySelector("ul");
const nickForm = document.getElementById("nick");
const messageForm = document.getElementById("message");
const socket = new WebSocket(`ws://${window.location.host}`);

const makeMessage = (type, payload) => {
  return JSON.stringify({
    type,
    payload,
  });
};

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (e) => {
  console.log("New message:", e.data);
  const li = document.createElement("li");
  li.innerText = e.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

const handleSubmit = (e) => {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
  input.focus();
};

const handleNickSubmit = (e) => {
  e.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
