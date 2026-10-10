let tasks = [];
let currentFilter = "all";


// Load tasks from server
async function loadTasks() {

    try {

        const response = await fetch("/api/tasks");

        tasks = await response.json();

        displayTasks();

    } catch (error) {

        console.error("Error loading tasks:", error);

    }
}


// Add new task
async function addTask() {

    const input = document.getElementById("taskInput");

    const taskText = input.value.trim();

    if (taskText === "") {

        alert("Please enter a task!");

        return;
    }

    try {

        const response = await fetch("/api/tasks", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: taskText
            })

        });

        const newTask = await response.json();

        tasks.push(newTask);

        input.value = "";

        displayTasks();

    } catch (error) {

        console.error("Error adding task:", error);

    }
}


// Complete / uncomplete task
async function toggleTask(id) {

    try {

        const response = await fetch(`/api/tasks/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            }

        });

        const updatedTask = await response.json();

        tasks = tasks.map(task => {

            if (task.id === id) {

                return updatedTask;

            }

            return task;

        });

        displayTasks();

    } catch (error) {

        console.error("Error updating task:", error);

    }
}


// Delete task
async function deleteTask(id) {

    try {

        await fetch(`/api/tasks/${id}`, {

            method: "DELETE"

        });

        tasks = tasks.filter(task => task.id !== id);

        displayTasks();

    } catch (error) {

        console.error("Error deleting task:", error);

    }
}


// Filter tasks
function showTasks(filter) {

    currentFilter = filter;

    displayTasks();

}


// Display tasks
function displayTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }


    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            '<li class="empty">No tasks found</li>';

    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="task-text">
                    ${task.text}
                </span>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>

        `;

        taskList.appendChild(li);

    });


    updateTaskCount();

}


// Update task count
function updateTaskCount() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completedTasks").textContent = completed;

}


// Press Enter to add task
document
    .getElementById("taskInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    });


// Load tasks when page opens
loadTasks();