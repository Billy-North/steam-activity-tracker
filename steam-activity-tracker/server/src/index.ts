import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { pool } from "./config";
import axios from "axios";
import * as dotenv from "dotenv";
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

app.get('/steamgetplayersummaries/:id', (req, res) => {
    try {
        axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${req.params.id}`)
            .then((response) => {
                const userData = response.data.response.players[0]
                if (userData) {
                    res.status(200).json({ status: "ok", data: userData })
                } else {
                    res.status(204).json({ status: "no content" })
                }
            });
    } catch {
        res.status(500)
    }
})







