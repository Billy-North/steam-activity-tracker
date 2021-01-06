import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { pool } from "./config";
import axios from "axios";
import * as dotenv from "dotenv";
import * as schedule from 'node-schedule';
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const port = 8080;



// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week(0 - 7)(0 or 7 is Sun)
// │    │    │    │    └───── month(1 - 12)
// │    │    │    └────────── day of month(1 - 31)
// │    │    └─────────────── hour(0 - 23)
// │    └──────────────────── minute(0 - 59)
// └───────────────────────── second(0 - 59, OPTIONAL)
// schedule.scheduleJob('1 30 23 * * *', () => {
schedule.scheduleJob('1 * * * * *', () => {
    console.log('Function called!')
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) { throw error }
        for (const user of results.rows) {
            axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${user.steamid}&format=json`)
                .then((response) => {
                    let activity2weeks = 0;
                    let updatedPreviouslyPlayedTime = 0;
                    if ('games' in response.data.response) {
                        for (const game of response.data.response.games) {
                            activity2weeks += game.playtime_2weeks
                        }
                        pool.query(`SELECT * FROM users WHERE steamid = ($1)`, [user.steamid], (error, results) => {
                            if (error) { throw error }
                            if (results.rows[0].previous_played_time === null) {
                                updatedPreviouslyPlayedTime = activity2weeks
                            } else {
                                updatedPreviouslyPlayedTime = activity2weeks - results.rows[0].previous_played_time
                                pool.query(`INSERT INTO activities (steamid,minutes) VALUES ($1,$2)`, [user.steamid, updatedPreviouslyPlayedTime], (error, results) => {
                                    if (error) { throw error }
                                })
                            }
                            pool.query(`UPDATE users SET previous_played_time = ($1) WHERE steamid = ($2)`, [updatedPreviouslyPlayedTime, user.steamid], (error, results) => {
                                if (error) { throw error }
                            })
                        })
                    }
                })
        }
    })
});


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
});

app.post('/addaccount/:id', (req, res) => {
    const { id } = req.params
    if (!id) {
        res.status(400)
    }

    pool.query(
        'INSERT INTO users (steamid) VALUES ($1)',
        [req.params.id],
        (error: any) => {
            if (error) {
                if (error.code === '23505') {
                    res.status(409).json({ status: 'conflict' })
                } else {
                    res.status(500).json({ status: 'internal server error' })
                }
            } else {
                res.status(201).json({ status: 'success', message: 'user added.' })
            }
        },
    )
})







