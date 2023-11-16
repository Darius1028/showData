const express = require("express");
const app = express();
const ipware = require("ipware")();
const fs = require("fs");


app.get("/imagen/*", (req, res) => {
  const segments = req.url.split('/');
  const nameImg = segments[segments.length - 1];
  const clientIP = ipware.get_ip(req);
  console.log("Cliente IP:", clientIP.clientIp);

  const pathImg = __dirname + '/' + nameImg;
  res.sendFile(pathImg);

  fs.appendFile("ips.txt", `${clientIP.clientIp}\n`, (err) => {
    if (err) {
      console.error("Error al guardar la dirección IP:", err);
    } else {
      console.log("Dirección IP guardada en ips.txt");
    }
  });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});