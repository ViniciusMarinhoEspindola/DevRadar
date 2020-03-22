const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const routes = require("./routes");
const { setupWebsocket } = require("./Websocket");

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect("mongodb://localhost:27017/Omnistack10", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
