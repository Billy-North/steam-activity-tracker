"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const axios_1 = __importDefault(require("axios"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
const port = 8080;
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