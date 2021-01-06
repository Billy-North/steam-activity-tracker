"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const axios_1 = __importDefault(require("axios"));
const schedule = __importStar(require("node-schedule"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
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
    // Loop through all steam ids in the data base
    // If previous hours exist compare todays hours against pevious to create hours for today and build new previous hours
    // If previous hours do no exist create previous hours
    console.log('Function called!');
    config_1.pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error;
        }
        for (const user of results.rows) {
            axios_1.default.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${user.steamid}&format=json`)
                .then((response) => {
                let activity2weeks = 0;
                let updatedPreviouslyPlayedTime = 0;
                if ('games' in response.data.response) {
                    for (const game of response.data.response.games) {
                        activity2weeks += game.playtime_2weeks;
                    }
                    config_1.pool.query(`SELECT * FROM users WHERE steamid = ($1)`, [user.steamid], (error, results) => {
                        if (error) {
                            throw error;
                        }
                        if (results.rows[0].previous_played_time === null) {
                            updatedPreviouslyPlayedTime = activity2weeks;
                        }
                        else {
                            updatedPreviouslyPlayedTime = activity2weeks - results.rows[0].previous_played_time;
                            config_1.pool.query(`INSERT INTO activities (steamid,minutes) VALUES ($1,$2)`, [user.steamid, updatedPreviouslyPlayedTime], (error, results) => {
                                if (error) {
                                    throw error;
                                }
                            });
                        }
                        console.log('this is the new previously played time', updatedPreviouslyPlayedTime, 'for user', user.steamid);
                        config_1.pool.query(`UPDATE users SET previous_played_time = ($1) WHERE steamid = ($2)`, [updatedPreviouslyPlayedTime, user.steamid], (error, results) => {
                            if (error) {
                                throw error;
                            }
                        });
                    });
                }
            });
        }
    });
});
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
app.get('/', (req, res) => {
    config_1.pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});
app.get('/steamgetplayersummaries/:id', (req, res) => {
    try {
        axios_1.default.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${req.params.id}`)
            .then((response) => {
            const userData = response.data.response.players[0];
            if (userData) {
                res.status(200).json({ status: "ok", data: userData });
            }
            else {
                res.status(204).json({ status: "no content" });
            }
        });
    }
    catch (_a) {
        res.status(500);
    }
});
app.post('/addaccount/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400);
    }
    config_1.pool.query('INSERT INTO users (steamid) VALUES ($1)', [req.params.id], (error) => {
        if (error) {
            if (error.code === '23505') {
                res.status(409).json({ status: 'conflict' });
            }
            else {
                res.status(500).json({ status: 'internal server error' });
            }
        }
        else {
            res.status(201).json({ status: 'success', message: 'user added.' });
        }
    });
});
//# sourceMappingURL=index.js.map