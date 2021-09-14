const express = require("express");
const todoApp = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
todoApp.use(express.urlencoded({ extended: true }));
todoApp.use("/static", express.static("public"));

//models
const TodoTask = require("./models/TodoTask");

//connection to db
// mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    todoApp.listen(3000, () => console.log("Server Up and running on 3000"));
});



//Setting up ejs template
todoApp.set("view engine", "ejs");


// GET METHOD
todoApp.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});


//POST METHOD
todoApp.post('/', async(req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
todoApp
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });


//DELETE
todoApp.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});