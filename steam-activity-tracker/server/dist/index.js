"use strict";
// import express from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// const port = 8080;
// app.listen(port, () => {
//     console.log(`server started at http://localhost:${port}`);
// });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
const port = 8080;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
// const getBooks = (request: any, response: any) => {
//     pool.query('SELECT * FROM users', (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(200).json(results.rows)
//     })
// }
app.get('/', (req, res) => {
    config_1.pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});
//# sourceMappingURL=index.js.map