const express = require("express");
const http = require("http");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const xmlToJson = require("xml2json");
const url = "http://localhost:32766";

const client = new Server(httpServer, {});
const options = {
  dotfiles: "ignore",
  etag: true,
  extensions: false,
  index: ["index.html"],
  maxAge: "0",
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set("x-timestamp", Date.now());
  },
};
app.use(express.static("src", options));

client.on("connect", (socket) => {
  const timer = setInterval(() => {
    http
      .get(url, (res) => {
        let data = "";
        res
          .on("data", (chunk) => {
            data += chunk;
          })
          .on("end", () => {
            data = xmlToJson.toJson(data);
            const softprojectorData = JSON.parse(data);
            client.emit("softpojector", softprojectorData);
          })
          .on("error", (err) => {
            client.emit("sp-error", "Nothing to parse");
          });
      })
      .on("error", (err) => {
        client.emit("sp-error", "Please connect to Softprojector");
      });
  }, 200);
});

httpServer.listen(4343);
