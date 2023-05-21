const express = require("express"); //Cargo el modulo de express
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
let router = express.Router();
const pool = require("../DAL/configuration/ConfigurationDB");

router.route("/getMerchantManagmentUnits/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantManagmentUnits({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantIndustries/:IdMerchant/:IdManagmentUnit").get((req, res) => {
    console.log("hola")
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantIndustries({ idMerchant: req.params.IdMerchant, idManagmentUnit: req.params.IdManagmentUnit })
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

router.route("/getTipologies/:IdMerchant/:IdIndustry").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getTipologies({ idMerchant: req.params.IdMerchant, idIndustry: req.params.IdIndustry })
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

router.route("/getMerchantLines/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantLines({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});


router.route("/getMerchantBodyFit/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantBodyFit({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantRise/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantRise({ idMerchant: req.params.IdMerchant })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantShoeMaterials/:IdMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantShoeMaterials(req.params.IdMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getMerchantSizeCurves").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaMerchant");
    currentBrand
        .getMerchantSizeCurves()
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
