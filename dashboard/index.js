"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000; // You can use any port that's free on your system
app.get("/", (req, res) => {
    res.send("Environmental Data Dashboard Backend is running!");
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
