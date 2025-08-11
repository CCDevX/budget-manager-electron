const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

const reduceBtn = document.getElementById("reduceBtn");
const sizeBtn = document.getElementById("sizeBtn");
const closeBtn = document.getElementById("closeBtn");

reduceBtn.addEventListener("click", (e) => {
  ipc.send("reduceApp");
});

sizeBtn.addEventListener("click", (e) => {
  ipc.send("sizeApp");
});

closeBtn.addEventListener("click", (e) => {
  ipc.send("closeApp");
});
