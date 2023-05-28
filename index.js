const cors = require("cors");
const express = require("express");
const app = express();
const dashboard = require("./RestApi/Dashboard");
const merchant = require("./RestApi/Merchant");
const user = require("./RestApi/User");
const listing = require("./RestApi/Listing");
const approvals = require("./RestApi/Approvals");
const dataSheet = require("./RestApi/DataSheet");
const bodyParser = require("body-parser");
const connection = require("./DAL/configuration/ConfigurationDB")
const fs = require("fs");

const port = process.env.PORT || 5173;
app.use(cors());

// Middleware para manejar solicitudes OPTIONS
app.options("/*", (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});

// Use your existing express app as before
app.use(express.json());
// app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use("/dashboard", dashboard);
app.use("/merchant", merchant);
app.use("/user", user);
app.use("/listing", listing);
app.use("/approvals", approvals);
app.use("/dataSheet", dataSheet);

app.get("/", (req, res) => {

    console.log("hellooo")
    connection.query('SELECT * FROM test', function (error, results, fields) {
        if (error) {
          console.error(error);
          return;
        }
      
        console.log('Table content:', results);
        res.send("Hello World!");
      });
});
