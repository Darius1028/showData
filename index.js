const express = require("express");
const app = express();
const ipware = require("ipware")();
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database("ips.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS ips (ip TEXT)");
});

app.get("/api", (req, res) => {
  db.all("SELECT ip FROM ips", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al consultar la base de datos");
    } else {
      const ips = rows.map((row) => row.ip).join("\n");
      res.send(ips);
    }
  });
});

app.get("/api/imagen/*", (req, res) => {
  const segments = req.url.split("/");
  const nameImg = segments[segments.length - 1];
  const clientIP = ipware.get_ip(req).clientIp;

  const pathImg = __dirname + "/" + nameImg;
  res.sendFile(pathImg);

  db.run("INSERT INTO ips (ip) VALUES (?)", [clientIP], (err) => {
    if (err) {
      console.error("Error al guardar la dirección IP:", err);
    } else {
      console.log("Dirección IP guardada en la base de datos");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});


module.exports = app;