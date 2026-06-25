const taskInput = document.querySelector("#taskInput");
const addButton = document.querySelector("#addButton");
const taskList = document.querySelector("#taskList");
const hint = document.querySelector("#hint");
const emptyState = document.querySelector("#emptyState");
const filterButtons = document.querySelectorAll(".filter-button");
const totalCount = document.querySelector("#totalCount");
const completedCount = document.querySelector("#completedCount");
const activeCount = document.querySelector("#activeCount");
const clearCompletedButton = document.querySelector("#clearCompletedButton");
const clearAllButton = document.querySelector("#clearAllButton");

const STORAGE_KEY = "tasks";

let tasks = loadTasks();
let currentFilter = "all";
let hintTimer;

// 从浏览器本地读取任务，并兼容之前旧版本保存的数据。
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  return savedTasks.map((task) => {
    if (typeof task === "string") {
      return {
        id: createId(),
        text: task,
        completed: false
      };
    }

    return {
      id: task.id || createId(),
      text: task.text,
      completed: Boolean(task.completed)
    };
  });
}

// 把当前任务数组保存到 localStorage。
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
  return Date.now().toString() + Math.random().toString(16).slice(2);
}

function showHint(message) {
  hint.textContent = message;
  clearTimeout(hintTimer);

  hintTimer = setTimeout(() => {
    hint.textContent = "";
  }, 1800);
}

function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

// 根据任务数组重新画出页面列表。
function renderTasks() {
  taskList.innerHTML = "";

  getVisibleTasks().forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    const completeButton = document.createElement("button");
    completeButton.className = "complete-button";
    completeButton.type = "button";
    completeButton.textContent = "✓";
    completeButton.addEventListener("click", () => toggleTask(task.id));

    const taskContent = document.createElement("span");
    taskContent.className = "task-text";
    taskContent.textContent = task.text;
    taskContent.title = "双击编辑";
    taskContent.addEventListener("dblclick", () => startEdit(task.id, taskContent));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskItem.append(completeButton, taskContent, deleteButton);
    taskList.append(taskItem);
  });

  updateSummary();
  updateEmptyState();
  updateFilterButtons();
}

function updateSummary() {
  const completedTotal = tasks.filter((task) => task.completed).length;

  totalCount.textContent = tasks.length;
  completedCount.textContent = completedTotal;
  activeCount.textContent = tasks.length - completedTotal;
}

function updateEmptyState() {
  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    showHint("请先输入任务内容");
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: createId(),
    text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }

    return {
      ...task,
      completed: !task.completed
    };
  });

  saveTasks();
  renderTasks();
}

// 双击文字后，把文字临时换成输入框来编辑。
function startEdit(id, taskContent) {
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return;
  }

  const editInput = document.createElement("input");
  editInput.className = "task-edit-input";
  editInput.type = "text";
  editInput.value = task.text;

  taskContent.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  let editFinished = false;

  function finishEdit() {
    if (editFinished) {
      return;
    }

    editFinished = true;
    const newText = editInput.value.trim();

    if (newText !== "") {
      task.text = newText;
      saveTasks();
    }

    renderTasks();
  }

  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      finishEdit();
    }
  });

  editInput.addEventListener("blur", finishEdit);
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

clearAllButton.addEventListener("click", () => {
  const confirmed = window.confirm("确定要清空全部任务吗？");

  if (!confirmed) {
    return;
  }

  tasks = [];
  saveTasks();
  renderTasks();
});

renderTasks();
