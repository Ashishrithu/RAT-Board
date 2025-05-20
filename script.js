let currentTask = null;

function addTask() {
  const title = document.getElementById("taskTitle").value;
  const desc = document.getElementById("taskDesc").value;
  if (!title) return;

  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.ondragstart = drag;
  task.onclick = () => openModal(task);

  const createdAt = new Date().toLocaleString();
  task.dataset.createdAt = createdAt;
  task.innerHTML = `
    <strong>${title}</strong><br/>
    <div class="desc">${desc}</div>
    <em>${createdAt}</em>
  `;

  document.getElementById("newItem").appendChild(task);

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.outerHTML);
  ev.dataTransfer.setData("from", ev.target.parentElement.id);
  ev.target.remove();
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const temp = document.createElement("div");
  temp.innerHTML = data;
  const task = temp.firstChild;
  task.onclick = () => openModal(task);
  ev.target.appendChild(task);
}

function openModal(task) {
  currentTask = task;
  document.getElementById("modalTitleInput").value = task.querySelector("strong").innerText;
  document.getElementById("modalDescInput").value = task.querySelector(".desc").innerText;
  document.getElementById("modalDate").innerText = task.dataset.createdAt;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  currentTask = null;
  document.getElementById("overlay").style.display = "none";
  document.getElementById("modal").style.display = "none";
}

function saveEdit() {
  if (!currentTask) return;
  currentTask.querySelector("strong").innerText = document.getElementById("modalTitleInput").value;
  currentTask.querySelector(".desc").innerText = document.getElementById("modalDescInput").value;
  closeModal();
}

function deleteTask() {
  if (!currentTask) return;
  currentTask.remove();
  closeModal();
}
