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


router.route("/getSuppliersForMerchant/:IdMerchant").get((req, res) => {
    console.log("getting all suppliers");
    currentBrand = new DynamicClass("ImpactaSupplier");
    currentBrand
        .getAllSuppliersForMerchant(req.params.IdMerchant)
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