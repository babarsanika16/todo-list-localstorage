// Selecting HTML Elements
const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearButton = document.getElementById("clear-completed");

// Store all tasks
let tasks = [];
let currentFilter = "all";

// Load saved tasks from LocalStorage
function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        tasks = Array.isArray(savedTasks) ? savedTasks : [];
    } catch (error) {
        tasks = [];
    }
}

// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks on the page
function renderTasks() {
    list.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "done") return task.done;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        if (task.done) {
            li.classList.add("done");
        }

        const label = document.createElement("span");
        label.textContent = task.text;

        const toggleButton = document.createElement("button");
        toggleButton.textContent = task.done ? "Undo" : "Done";
        toggleButton.dataset.action = "toggle";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";

        li.append(label, toggleButton, deleteButton);
        list.appendChild(li);
    });

    const remainingTasks = tasks.filter(task => !task.done).length;
    count.textContent = `${remainingTasks} left`;
}

// Add new task
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = input.value.trim();

    if (taskText === "") {
        input.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    input.value = "";
    input.focus();
});

// Complete and Delete tasks
list.addEventListener("click", function(event) {
    const action = event.target.dataset.action;

    if (!action) return;

    const taskElement = event.target.closest("li");
    if (!taskElement) return;

    const taskId = Number(taskElement.dataset.id);

    if (action === "delete") {
        tasks = tasks.filter(task => task.id !== taskId);
    }

    if (action === "toggle") {
        tasks.forEach(task => {
            if (task.id === taskId) {
                task.done = !task.done;
            }
        });
    }

    saveTasks();
    renderTasks();
});

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Clear completed tasks
clearButton.addEventListener("click", function() {
    tasks = tasks.filter(task => !task.done);

    saveTasks();
    renderTasks();
});

// Initialize application
loadTasks();
renderTasks();