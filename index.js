const express = require("express")
const cors = require("cors")
const app = express()
const pool = require("./db")
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json("Hello")
})

app.post("/create", async (req, res) => {
    try {


        const { description } = req.body
        const newPool = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description])
        //    Returning * is used when we create, update and delete to return the data
        res.json(newPool.rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json("Server Error")

    }
})

app.get("/todos", async (req, res) => {
    try {


        const todos = await pool.query("SELECT * FROM todo")
        res.json(todos.rows)
        // To get only the data what we need, acutally will get some more extra data, like what commands etc.. stuff like that so to get what we need we use .rows
    } catch (error) {
        console.log(error)
        return res.status(500).json("Server Error")
    }
})

app.get("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        res.json(todo.rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json("Server Error")
    }
})

app.put("/update/:id", async (req, res) => {
    try {
        const { description } = req.body
        const { id } = req.params
        const updated = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id])
        res.json("Your Todo is Updated...")
    } catch (error) {
        console.log(error)
        return res.status(500).json("Server Error")
    }
})

app.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        res.json("Todo Deleted Successfully!")
    } catch (error) {
        console.log(error)
        return res.status(500).json("Server Error")
    }
})

app.listen(7000, () => {
    console.log("Connected To Backend....")
})