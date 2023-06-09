const { Console } = require("console");
const { on } = require("events");
const con = require("../configuration/ConfigurationDB");
const util = require("util");
const pool = require("../configuration/ConfigurationDB");
const { resolve } = require("path");

// node native promisify
//const query = util.promisify(con.query).bind(con);

function getSeasons({ idMerchant, idDepartment }) {
    pool.connect(function (err) {
        if (err) throw err;
        pool.query(
            "SELECT season.NAME Name," +
                "season.START_DATE StartDate, " +
                "season.END_DATE EndDate " +
                "FROM SEASON season " +
                "INNER JOIN SEASON_DEPARTMENT seasonDepartment ON season.ID = seasonDepartment.ID_SEASON " +
                "WHERE ID_MERCHANT = " +
                idMerchant +
                "AND ID_DEPARTMENT = " +
                idDepartment +
                "AND SEASON.START_DATE >= CONVERT(DATE,GETDATE()) AND SEASON.END_DATE <= CONVERT(DATE,GETDATE())",
            function (err, result, fields) {
                if (err) throw err;
                return result;
            }
        );
    });
}

function getBalanceData({ idMerchant, idSeason }) {
    let sqlString =
        "SELECT prod.ID IdProduct, prod.ID_INSPECTION IdInspection, prod.SHIPPING_DATE ShippingDate, DATEDIFF(now(),prod.SHIPPING_DATE) DaysBeforeShipping FROM SEASON season,PRODUCT prod WHERE season.ID = prod.ID_SEASON AND prod.ID_MERCHANT = " +
        idMerchant +
        " and prod.ID_SEASON = " +
        idSeason;
    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getSeasonData({ idMerchant, idSeason }) {
    con.connect(function (err) {
        if (err) throw err;
        pool.query(
            "SELECT season.NAME Name, " +
                "season.START_DATE StartDate, " +
                "season.END_DATE EndDate " +
                "FROM SEASON season " +
                "WHERE season.ID = " +
                idSeason +
                " AND season.ID_MERCHANT = " +
                idMerchant,
            function (err, result, fields) {
                if (err) throw err;
                return result;
            }
        );
    });
}

function getBalanceDatesConfig({ idMerchant }) {
    let stringQuery =
        "SELECT bdc.ATT_DFS_FOR_NOT_APPROVED AttentionDaysConfigForNotApproved, bdc.CRIT_DFS_FOR_PENDANT CriticalDaysConfigForPendant, bdc.CRIT_DFS_FOR_NOT_APPROVED CriticalDaysConfigForNotApproved, bdc.ATT_DFS_FOR_PENDANT AttentionDaysConfigForPendant FROM BALANCE_DATES_CONFIG bdc WHERE bdc.ID_MERCHANT = " +
        idMerchant;
    return new Promise(function (resolve, reject) {
        pool.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getShippingDates({ idMerchant, idSeason, month, year }) {
    let stringQuery =
        "SELECT p.SHIPPING_DATE ShippingDate, p.product_order OrderNumber FROM PRODUCT p INNER JOIN SEASON s ON p.ID_SEASON = s.ID WHERE s.ID = " +
        idSeason +
        " AND p.ID_MERCHANT = " +
        idMerchant +
        " AND MONTH(p.SHIPPING_DATE) = " +
        month +
        " AND YEAR(p.SHIPPING_DATE) = " +
        year;

    return new Promise(function (resolve, reject) {
        pool.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getProductsStatus({ idMerchant, idSeason }) {
    let stringQuery =
        "SELECT I.DESCRIPTION, COUNT(*) ProducsPerSeason FROM PRODUCT P INNER JOIN INSPECTION I ON I.ID = P.ID_INSPECTION WHERE P.ID_MERCHANT = " +
        idMerchant +
        " AND P.ID_SEASON = " +
        idSeason +
        " GROUP BY P.ID_INSPECTION";
    return new Promise(function (resolve, reject) {
        pool.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getDataForMarginCalculations(idMerchant, idSeason) {
    let stringQuery =
        "SELECT SUM(cost) as sumCost, SUM(cost_in_store) as sumCostInStore FROM PRODUCT WHERE ID_SEASON = " +
        idSeason +
        " AND ID_MERCHANT = " +
        idMerchant;
    return new Promise(function (resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getTopProductsWithStatus(idMerchant, idSeason, idStatus, limit) {
    let stringQuery =
        "select prod.name Name from product prod where prod.ID_MERCHANT = " +
        idMerchant +
        " AND ID_STATUS = 2 AND ID_SEASON = " +
        idSeason +
        " limit 6";
    return new Promise(function (resolve, reject) {
        pool.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getSKUsAndPieces(idMerchant, idSeason, idCategory) {
    let sqlString = `SELECT
      #p.NAME ProductName,
      #p.ID ProductID,
      c.Description CategoryName,
      #m.ID MerchantID,
      t.ID_CATEGORY CategoryID,
      #pc.ID_PRODUCT ProductID,
      COUNT(ps.SKU) SkuQuantity,
      SUM(ps.QUANTITY) TotalPCS,
      SUM(ps.TARGET_SKU) TargetSKU,
      SUM(ps.TARGET_PCS) TargetPCS,
      SUM(ps.TARGET_SKU) - COUNT(ps.SKU) GapSku,
      SUM(ps.TARGET_PCS) - SUM(ps.QUANTITY) GapPcs
      #S.NAME Season,
      #s.id SeasonId
    FROM
      category c, 
      season s, 
      merchant m, 
      product p, 
      product_sku ps,
			tipology t
    WHERE
			t.ID_CATEGORY = c.ID AND
      t.id = p.id_tipology AND
      m.ID = ${idMerchant} AND
      s.ID = ${idSeason} AND
      c.ID = ${idCategory} AND
      p.ID_SEASON = s.ID AND
      m.ID = c.ID_MERCHANT AND
      ps.ID_PRODUCT = p.ID
GROUP BY c.ID`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getAllSKUsAndPieces(idMerchant, idSeason) {
    let sqlString = `SELECT
        #p.NAME ProductName,
        #p.ID ProductID,
        c.Description CategoryName,
        #m.ID MerchantID,
        T.ID_CATEGORY CategoryID,
        #pc.ID_PRODUCT ProductID,
        COUNT(ps.SKU) SkuQuantity,
        SUM(ps.QUANTITY) TotalPieces,
        SUM(ps.TARGET_SKU) TargetSKU,
        SUM(ps.TARGET_PCS) TargetPCS,
        SUM(ps.TARGET_SKU) - COUNT(ps.SKU) GapSku,
        SUM(ps.TARGET_PCS) - SUM(ps.QUANTITY) GapPcs
        #S.NAME Season,
        #S.NAME Season,
        #s.id SeasonId
      FROM
        category c, 
        season s, 
        merchant m, 
        product p, 
        product_sku ps, 
        tipology t
                                  
      WHERE
        m.ID = ${idMerchant} AND
        s.ID = ${idSeason} AND
        p.ID_SEASON = s.ID AND
        p.ID_tipology = t.id AND
                                  t.ID_CATEGORY = c.id AND
        m.ID = c.ID_MERCHANT AND
        ps.ID_PRODUCT = p.ID
      GROUP BY c.ID
      ORDER BY c.ID`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getPendantAvios(idSeason) {
    let sqlString = `
        select 
        count(ca.id_product) cantidadSinAprobar
        FROM
        product p,
        combo_avio ca,
        season ss
        where
        p.ID = ca.id_product and
        ca.ID_STATUS = 1 AND
        ss.ID = p.ID_SEASON AND
        p.ID_SEASON = ${idSeason}
        `;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return sqlString;
            }

            resolve(rows);
        });
    });
}

function getPendantColorsAndPrints(idSeason) {
    let sqlString = `
        SELECT count(combo_fabric.ID_PRODUCT) + 
        (select
        count(combo_fabric.ID_STATUS_PRINT) 
        FROM
        combo_fabric,
        product,
        season
        where
        combo_fabric.ID_STATUS_PRINT = 1 AND
        product.ID = combo_fabric.ID_PRODUCT AND
        season.ID = combo_fabric.ID_STATUS_PRINT AND
        combo_fabric.ID_PRINT <> 0 AND
        product.ID_SEASON = ${idSeason}) cantidadSinAprobar
        from combo_fabric, season, product 
        where combo_fabric.ID_STATUS_COLOR = 1 and 
        product.ID = combo_fabric.ID_PRODUCT and 
        product.ID_SEASON = ${idSeason} AND 
        season.ID = combo_fabric.ID_STATUS_COLOR`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getTotalRequestedAvios(idSeason) {
    let sqlString = `
        select 
        count(ca.id_product) total
        FROM
        product p,
        combo_avio ca,
        season ss
        where
        p.ID = ca.id_product and
        ss.ID = p.ID_SEASON AND
        p.ID_SEASON = ${idSeason}
        `;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getTotalRequestedColorsAndPrints(idSeason) {
    let sqlString = `
        SELECT count(combo_fabric.ID_PRODUCT) + 
        (select
        count(combo_fabric.ID_STATUS_PRINT) 
        FROM
        combo_fabric,
        product,
        season
        where
        product.ID = combo_fabric.ID_PRODUCT AND
        season.ID = combo_fabric.ID_STATUS_PRINT AND
        combo_fabric.ID_PRINT <> 0 AND
        product.ID_SEASON = ${idSeason}) total
        from combo_fabric, season, product 
        where 
        product.ID = combo_fabric.ID_PRODUCT and 
        product.ID_SEASON = ${idSeason} AND 
        season.ID = combo_fabric.ID_STATUS_COLOR AND
        combo_fabric.ID_STATUS_COLOR <> 0
        `;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getPendantQualities(idSeason) {
    let sqlString = `
        SELECT
            count(combo_fabric.ID_PRODUCT) cantidadSinAprobar
        FROM
            combo_fabric
        INNER JOIN product on combo_fabric.ID_PRODUCT = product.ID
        INNER JOIN season on season.ID = combo_fabric.ID_STATUS
        WHERE
            product.ID_SEASON = ${idSeason} AND
            combo_fabric.ID_STATUS = 1
        `;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getTotalRequestedQualities(idSeason) {
    let sqlString = `
        SELECT
            count(combo_fabric.ID_PRODUCT) total
        FROM
            combo_fabric
        INNER JOIN product on combo_fabric.ID_PRODUCT = product.ID
        INNER JOIN season on season.ID = combo_fabric.ID_STATUS
        WHERE
            product.ID_SEASON = ${idSeason} 
        `;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

async function getPendantApprovals(idMerchant, idSeason) {
    return new Promise(function (resolve, reject) {
        let pendantAvios;
        let pendantColorsAndPrints;
        let totalAvios;
        let totalRequestedColorsAndPrints;
        let pendantQualities;
        let totalRequestedQualities;

        getPendantAvios(idSeason).then((result) => {
            pendantAvios = result[0].cantidadSinAprobar;
            getPendantColorsAndPrints(idSeason).then((result) => {
                pendantColorsAndPrints = result[0].cantidadSinAprobar;
                getTotalRequestedAvios(idSeason).then((result) => {
                    totalAvios = result[0].total;
                    getTotalRequestedColorsAndPrints(idSeason).then(
                        (result) => {
                            totalRequestedColorsAndPrints = result[0].total;
                            getPendantQualities(idSeason).then((result) => {
                                pendantQualities = result[0].cantidadSinAprobar;
                                getTotalRequestedQualities(idSeason).then(
                                    (result) => {
                                        totalRequestedQualities =
                                            result[0].total;
                                        let percentageAvios =
                                            (pendantAvios * 100) / totalAvios;
                                        let percentageColorsAndPrints =
                                            (pendantColorsAndPrints * 100) /
                                            totalRequestedColorsAndPrints;
                                        let percentageQualities =
                                            (pendantQualities * 100) /
                                            totalRequestedQualities;
                                        let resp = {
                                            PercentegeAvios:
                                                Math.round(percentageAvios),
                                            PercentegeColorsAndPrints:
                                                Math.round(
                                                    percentageColorsAndPrints
                                                ),
                                            PercentageQualities:
                                                Math.round(percentageQualities),
                                        };
                                        resolve(resp);
                                    }
                                );
                            });
                        }
                    );
                });
            });
        });
    });
}

module.exports.getPendantApprovals = getPendantApprovals;
module.exports.getSKUsAndPieces = getSKUsAndPieces;
module.exports.getAllSKUsAndPieces = getAllSKUsAndPieces;
module.exports.getProductsStatus = getProductsStatus;
module.exports.getBalanceDatesConfig = getBalanceDatesConfig;
module.exports.getSeasonData = getSeasonData;
module.exports.getBalanceData = getBalanceData;
module.exports.getShippingDates = getShippingDates;
module.exports.getTopProductsWithStatus = getTopProductsWithStatus;
module.exports.getDataForMarginCalculations = getDataForMarginCalculations;
