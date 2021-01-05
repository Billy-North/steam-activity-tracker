import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { pool } from "./config";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())




const port = 8080;

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});


app.get('/', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) { throw error }
        res.status(200).json(results.rows)
    })
})