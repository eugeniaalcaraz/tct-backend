const express = require("express"); //Cargo el modulo de express
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
let router = express.Router();
const pool = require("../DAL/configuration/ConfigurationDB");


router.route("/getSuppliers/:IdMerchant").get((req, res) => {
    // currentBrand = new DynamicClass("ImpactaMerchant");
    // currentBrand
    //     .getMerchantManagmentUnits({ idMerchant: req.params.IdMerchant })
    //     .then((result) => {
    //         res.status(200);
    //         res.send(result);
    //     })
    //     .catch((err) => {
    //         res.status(400);
    //         res.send(err);
    //     });
});

router.route("/getSupplierTypes/:IdMerchant").get((req, res) => {
    // currentBrand = new DynamicClass("ImpactaMerchant");
    // currentBrand
    //     .getMerchantManagmentUnits({ idMerchant: req.params.IdMerchant })
    //     .then((result) => {
    //         res.status(200);
    //         res.send(result);
    //     })
    //     .catch((err) => {
    //         res.status(400);
    //         res.send(err);
    //     });
});