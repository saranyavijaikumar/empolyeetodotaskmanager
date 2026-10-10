const express = require("express");

const path = require("path");

const app = express();

const PORT = 3000;


// Middleware
app.use(express.json());


// Serve frontend files
app.use(express.static(__dirname));


// Temporary task storage
let tasks = [];

let nextId = 1;


// Get all tasks
app.get("/api/tasks", (req, res) => {

    res.json(tasks);

});


// Add task
app.post("/api/tasks", (req, res) => {

    const { text } = req.body;

    if (!text || text.trim() === "") {

        return res.status(400).json({
            message: "Task cannot be empty"
        });

    }

    const newTask = {

        id: nextId++,

        text: text.trim(),

        completed: false

    };

    tasks.push(newTask);

    res.status(201).json(newTask);

});


// Update task
app.put("/api/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    task.completed = !task.completed;

    res.json(task);

});


// Delete task
app.delete("/api/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const taskExists = tasks.some(task => task.id === id);

    if (!taskExists) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    tasks = tasks.filter(task => task.id !== id);

    res.json({
        message: "Task deleted successfully"
    });

});


// Start server
app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});