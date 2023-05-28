const express = require("express"); //Cargo el modulo de express
const { send } = require("process");
let router = express.Router();
const app = require("../DefaultMerchant/app");
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
const pool = require("../DAL/configuration/ConfigurationDB");

router.route("/getAllProducts/:idMerchant/:idSeason").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getAllProducts(req.params.idMerchant, req.params.idSeason)
        .then((result) => {
            res.send(result);
        });
});

router.route("/prueba/").get((req, res) => {
    res.send("hola y chau");
});

router
    .route(
        "/getAllProductsWithFilters/:idMerchant/:idSeason/:idDesigner/:idFabric/:idDepartment/:idSupplier/:idTIPOLOGY/:idStatus/:ProductName/:ProductPrice/:ProductWeight/:idOrigin/:idDestination/:idShippingType/:shippingDate/:productSku"
    )
    .get((req, res) => {
        currentBrand = new DynamicClass("ImpactaListing");
        currentBrand
            .getAllProductsWithFilters(
                req.params.idMerchant,
                req.params.idSeason,
                req.params.idDesigner,
                req.params.idFabric,
                req.params.idDepartment,
                req.params.idSupplier,
                req.params.idTIPOLOGY,
                req.params.idStatus,
                req.params.ProductName,
                req.params.ProductPrice,
                req.params.ProductWeight,
                req.params.idOrigin,
                req.params.idDestination,
                req.params.idShippingType,
                req.params.shippingDate,
                req.params.productSku
            )
            .then((result) => {
                res.status(200);
                res.send(result);
            })
            .catch((err) => {
                res.status(400);
                res.send(err);
            });
    });

router.route("/getShippingTypes/:idMerchant").get((req, res) => {
    //
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand.getShippingTypes(req.params.idMerchant).then((result) => {
        res.status(200);
        res.send(result);
    });
});

router.route("/getSupplierName/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getSupplierName(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getDesigners/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getDesigners(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getWeight/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getWeight(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

///
router.route("/getStatus/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getStatus(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getQuality/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getQuality(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getProductsNames/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getProductsNames(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getCountries/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getCountries(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getSeasons/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getSeasons(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getDepartments/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getDepartments(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/getTipologies/:idMerchant").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaListing");
    currentBrand
        .getTipologies(req.params.idMerchant)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

router.route("/").get((req, res) => {
    res.send("HOLA LISTING");
});

module.exports = router;
