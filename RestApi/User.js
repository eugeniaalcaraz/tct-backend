const express = require("express"); //Cargo el modulo de express
let router = express.Router();

router.route("/:idMerchant").get((req, res) => {
    res.send("user " + req.params.idMerchant);
});

module.exports = router;
