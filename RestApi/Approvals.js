const express = require("express"); //Cargo el modulo de express
const { send } = require("process");
let router = express.Router();
const app = require("../DefaultMerchant/app");
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
const pool = require("../DAL/configuration/ConfigurationDB");

router.route("/getApprovals/:idProduct").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaApprovals");
    currentBrand
        .getApprovals(req.params.idProduct)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

router.route("/").get((req, res) => {
    res.send("HOLA APPROVALS");
});

module.exports = router;
