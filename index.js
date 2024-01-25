"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const serialport_1 = require("serialport");
const cors = require("cors");
const app = (0, express_1.default)();
const serverPort = 3000;
// Use CORS middleware to enable cross-origin requests
app.use(cors());
const db = new sqlite3_1.default.Database("environment_data.db", (err) => {
    if (err)
        console.error(err.message);
    else
        console.log("Connected to the SQLite database.");
});
db.run("CREATE TABLE IF NOT EXISTS data (date TEXT, temperature REAL, humidity REAL)");
app.use(cors()); // Use the cors middleware to enable CORS
const arduinoPort = new serialport_1.SerialPort({
    path: "/dev/cu.usbmodem1422301",
    baudRate: 9600,
});
const parser = arduinoPort.pipe(new serialport_1.ReadlineParser());
parser.on("data", (data) => {
    const [temperature, humidity] = data.split(",");
    const date = new Date().toISOString();
    db.run(`INSERT INTO data (date, temperature, humidity) VALUES (?, ?, ?)`, [
        date,
        temperature,
        humidity,
    ]);
});
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.listen(serverPort, () => {
    console.log(`Server listening on port ${serverPort}`);
});
app.get("/api/environment-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db.all("SELECT * FROM data", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
}));
