import express from "express";
import sqlite3 from "sqlite3";
import { SerialPort, ReadlineParser } from "serialport";
const cors = require("cors");

const app = express();
const serverPort = 3000;

// Use CORS middleware to enable cross-origin requests
app.use(cors());

const db = new sqlite3.Database("environment_data.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to the SQLite database.");
});

db.run(
  "CREATE TABLE IF NOT EXISTS data (date TEXT, temperature REAL, humidity REAL)"
);

app.use(cors()); // Use the cors middleware to enable CORS

const arduinoPort = new SerialPort({
  path: "/dev/cu.usbmodem1422301",
  baudRate: 9600,
});

const parser = arduinoPort.pipe(new ReadlineParser());

parser.on("data", (data: string) => {
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

app.get("/api/environment-data", async (req, res) => {
  db.all("SELECT * FROM data", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});
