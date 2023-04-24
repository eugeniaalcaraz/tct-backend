const express = require("express"); //Cargo el modulo de express
let router = express.Router();
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
const pool = require("../DAL/configuration/ConfigurationDB");
//let formidable = require('formidable');

router.route("/saveProduct").post((req, res) => {
    const body = req.body;
    currentBrand = new DynamicClass("ImpactaDataSheet");
    currentBrand
        .saveNewProduct(body)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

module.exports = router;

router.route("/:idMerchant").get((req, res) => {
    res.send("merchant " + req.params.idMerchant);
});
