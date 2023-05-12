const express = require("express"); //Cargo el modulo de express
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
let router = express.Router();
const pool = require("../DAL/configuration/ConfigurationDB");

router.route("/getMerchantDepartments/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantDepartments({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantSeasons/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantSeasons({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});
router.route("/getMerchantSuppliers/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantSuppliers({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getCountries/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getCountries()
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getTipologies/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getTipologies()
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getFibers/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getFibers()
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantDesigners/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantDesigners({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getColors/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getColors({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getTrims/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getTrims()
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getPlacements/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getPlacements()
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantFibers/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getFibers()
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getFabrics/:IdMerchant").get((req, res) => {
    console.log("aaaaaaaaaaaaaaaaa")
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getFabrics(req.params.IdMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getShippingTypes/:IdMerchant").get((req, res) => {
    console.log("hola 2")
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getShippingTypes({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantBrands/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantBrands({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantConcepts/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantConcepts({ idMerchant: req.params.IdMerchant })
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
