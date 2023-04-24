const express = require("express"); //Cargo el modulo de express
const { send } = require("process");
let router = express.Router();
const app = require("../DefaultMerchant/app");
const DynamicClass = require("../DefaultMerchant/MerchantBuilder");
const pool = require("../DAL/configuration/ConfigurationDB");

router.route("/getProductsStatus/:idMerchant/:idSeason").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand
        .getProductStatusForSeason({
            idMerchant: req.params.idMerchant,
            idSeason: req.params.idSeason,
        })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((error) => {
            res.status(400);
            res.send(error);
        });
});

router.route("/getBalanceData/:idMerchant/:idSeason").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand
        .getBalanceData({
            idMerchant: req.params.idMerchant,
            idSeason: req.params.idSeason,
        })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

router.route("/getSeasons/:idMerchant/:idDepartment").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand
        .getSeasons({
            idMerchant: req.params.idMerchant,
            idDepartment: req.params.idDepartment,
        })
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

router
    .route("/getCalendarData/:IdMerchant/:IdSeason/:Month/:Year")
    .get((req, res) => {
        currentBrand = new DynamicClass("ImpactaDashboard");
        currentBrand
            .getCalendarData({
                idMerchant: req.params.IdMerchant,
                idSeason: req.params.IdSeason,
                month: req.params.Month,
                year: req.params.Year,
            })
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
    res.send("HOLA");
});

router
    .route("/getSKUsAndPieces/:idMerchant/:idSeason/:idCategory")
    .get((req, res) => {
        currentBrand = new DynamicClass("ImpactaDashboard");
        currentBrand.sayHello();
        currentBrand
            .getSKUsAndPieces(
                req.params.idMerchant,
                req.params.idSeason,
                req.params.idCategory
            )
            .then((result) => {
                res.status(200);
                res.send(result);
            })
            .catch((err) => {
                res.status(400);
                res.send(error);
            });
    });

router.route("/getAllSKUsAndPieces/:idMerchant/:idSeason").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand.sayHello();
    currentBrand
        .getAllSKUsAndPieces(req.params.idMerchant, req.params.idSeason)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

router.route("/getSeasonMargin/:idMerchant/:idSeason").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand
        .getSeasonMargin(req.params.idMerchant, req.params.idSeason)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

router.route("/getTopSixSentSamples/:idMerchant/:idSeason").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand
        .getTopSixProductsWithStatusOnTheWay(
            req.params.idMerchant,
            req.params.idSeason
        )
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

router.route("/getAllProducts/:idMerchant/:filters").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand
        .getAllSKUsAndPieces(req.params.idMerchant, req.params.filters)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

router.route("/getPendantApprovals/:idMerchant/:idSeason").get((req, res) => {
    currentBrand = new DynamicClass("ImpactaDashboard");
    currentBrand
        .getPendantApprovals(req.params.idMerchant, req.params.idSeason)
        .then((result) => {
            res.status(200);
            res.send(result);
        })
        .catch((err) => {
            res.status(400);
            res.send(error);
        });
});

module.exports = router;
