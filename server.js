require("dotenv").config();

const express = require("express");
const db = require("./models");
const routes = require("./routes/");

var app = express();
const http = require("http").Server(app);

var PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("client/build"));
app.use(routes);

var syncOptions = { force: false };

if (process.env.NODE_ENV === "test") {
    syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(function() {
    http.listen(PORT, function() {
        console.log("Listening on port ", PORT, ". Visit http://localhost:5000 in your browser.");
    });
});

module.exports.app = app;