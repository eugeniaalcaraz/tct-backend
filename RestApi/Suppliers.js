const express = require("express");
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
let router = express.Router();


router.route("/saveSupplier").post((req, res) => {
    const body = req.body;
    currentBrand = new DynamicClass("ImpactaSupplier");
    currentBrand
        .saveSupplier(body)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/updateSupplier").post((req, res) => {
    const body = req.body;
    currentBrand = new DynamicClass("ImpactaSupplier");
    currentBrand
        .updateSupplier(body)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});
router.route("/getSupplierFormData").get((req, res) => {
    const body = req.body;
    currentBrand = new DynamicClass("ImpactaSupplier");
    currentBrand
        .getSupplierFormInfo()
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getSupplier/:IdSupplier").get((req, res) => {
    const body = req.body;
    currentBrand = new DynamicClass("ImpactaSupplier");
    currentBrand
        .getSupplier(req.params.IdSupplier)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});


router.route("/getSuppliersForMerchant").get((req, res) => {
    const idMerchant = req.query.idMerchant;
    const score = req.query.score; 
    const alias = req.query.alias; 
    const origin = req.query.origin; 
    const type = req.query.type; 
    const product = req.query.product; 
    console.log("getting all suppliers");
    currentBrand = new DynamicClass("ImpactaSupplier");
    currentBrand
        .getAllSuppliersForMerchant(idMerchant, score, alias, origin, type, product)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
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
module.exports = router;