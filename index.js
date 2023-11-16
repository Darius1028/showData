const express = require("express");
const app = express();
const ipware = require("ipware")();
const fs = require("fs");


app.get("/api", (req, res) => {
    const file = __dirname + '/ips.txt' ;
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al leer el archivo");
      } else {
        res.send(data);
      }
    });
  });
  

app.get("/api/imagen/*", (req, res) => {
  const segments = req.url.split('/');
  const nameImg = segments[segments.length - 1];
  const clientIP = ipware.get_ip(req);
  console.log("Cliente IP:", clientIP.clientIp);

  const pathImg = __dirname + '/' + nameImg;
  res.sendFile(pathImg);

  const file = __dirname + '/ips.txt' ;

  fs.appendFile(file, `${clientIP.clientIp}\n`, (err) => {
    if (err) {
      console.error("Error al guardar la dirección IP:", err);
    } else {
      console.log("Dirección IP guardada en ips.txt");
    }
  });
});


module.exports = app;