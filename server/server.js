const express = require("express");
const app = express();
const db = require("./database/viewModel");
const cors = require("cors");
const counter = require("./counter");

var job;
const port = 1337;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/set-interval", async (req, res) => {
    const result = await db.SetInterval(req.body);
    job = counter.RecurrenceJob(req.body, job);
    res.status(200).json(result);
})

app.get("/interval", async (req, res) => {
    const result = await db.GetInterval();

    res.status(200).json(result);
})

app.get("/quotes", async (req, res) => {
    const result = await db.GetQuotes();

    res.status(200).json(result);
})

// Запуск задачи
job = counter.ScheduleJob();
console.log("server.js: Задача запущена.");
app.listen(port, () => console.log(`Server is running on port ${port}`));