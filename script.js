let taskCounter = 1;
let taskData = {};
let currentEditId = null;

window.onload = () => {
  loadTasks();

  document.getElementById('addTaskBtn').addEventListener('click', addTask);
  document.getElementById('saveEditBtn').addEventListener('click', saveEdit);
  document.getElementById('deleteBtn').addEventListener('click', deleteTask);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('overlay').addEventListener('click', closeModal);
};

function allowDrop(e) {
  e.preventDefault();
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  e.target.classList.add('dragging');
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

function drop(e) {
  e.preventDefault();
  const taskId = e.dataTransfer.getData('text/plain');
  const taskElem = document.getElementById(taskId);

  // Find closest column element
  let columnElem = e.target;
  while (columnElem && !columnElem.classList.contains('column')) {
    columnElem = columnElem.parentElement;
  }
  if (!columnElem) return;

  // Append task to task-list container inside column
  columnElem.querySelector('.task-list').appendChild(taskElem);

  // Update data
  taskData[taskId].column = columnElem.id;
  saveTasks();
}

function addTask() {
  const titleInput = document.getElementById('taskTitle');
  const descInput = document.getElementById('taskDesc');
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) {
    alert('Please enter a task title.');
    return;
  }

  const id = `TASK-${String(taskCounter).padStart(3, '0')}`;
  taskData[id] = {
    title,
    desc,
    column: 'newItem'
  };
  taskCounter++;

  renderTask(id, taskData[id]);
  saveTasks();

  titleInput.value = '';
  descInput.value = '';
}

function renderTask(id, task) {
  // Remove if exists (for refresh)
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = `task ${task.column}`;
  div.id = id;
  div.setAttribute('draggable', 'true');

  // Title part
  const titleSpan = document.createElement('div');
  titleSpan.textContent = `${id}: ${task.title}`;
  titleSpan.style.userSelect = "text";

  // Description part
  const descDiv = document.createElement('div');
  descDiv.className = 'desc';
  descDiv.textContent = task.desc || 'No description provided.';

  div.appendChild(titleSpan);
  div.appendChild(descDiv);

  // Drag events
  div.addEventListener('dragstart', dragStart);
  div.addEventListener('dragend', dragEnd);

  // Click opens edit modal
  div.addEventListener('click', () => openEditModal(id));

  // Append to correct column's task-list container
  const col = document.getElementById(task.column);
  col.querySelector('.task-list').appendChild(div);
}

function openEditModal(id) {
  currentEditId = id;
  const task = taskData[id];
  if (!task) return;

  document.getElementById('editTitle').value = task.title;
  document.getElementById('editDesc').value = task.desc;
  document.getElementById('modal').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function closeModal() {
  currentEditId = null;
  document.getElementById('modal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function saveEdit() {
  if (!currentEditId) return;

  const newTitle = document.getElementById('editTitle').value.trim();
  const newDesc = document.getElementById('editDesc').value.trim();

  if (!newTitle) {
    alert('Task title cannot be empty.');
    return;
  }

  taskData[currentEditId].title = newTitle;
  taskData[currentEditId].desc = newDesc;

  renderTask(currentEditId, taskData[currentEditId]);
  saveTasks();
  closeModal();
}

function deleteTask() {
  if (!currentEditId) return;

  if (!confirm(`Are you sure you want to delete task ${currentEditId}?`)) return;

  // Remove from DOM and data
  const elem = document.getElementById(currentEditId);
  if (elem) elem.remove();
  delete taskData[currentEditId];
  saveTasks();
  closeModal();
}

function saveTasks() {
  localStorage.setItem('ratBoardTasks', JSON.stringify(taskData));
}

function loadTasks() {
  const stored = localStorage.getItem('ratBoardTasks');
  if (stored) {
    taskData = JSON.parse(stored);
    Object.entries(taskData).forEach(([id, task]) => {
      renderTask(id, task);
      // Update counter so no conflicts on new IDs
      const num = parseInt(id.split('-')[1]);
      if (num >= taskCounter) taskCounter = num + 1;
    });
  }
}
