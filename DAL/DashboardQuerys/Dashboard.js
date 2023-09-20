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
                "FROM SEASON SEASON " +
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
        `SELECT product.ID IdProduct, 
                product.ID_INSPECTION IdInspection, 
                cb.ENTRY_DATE ShippingDate, 
                DATEDIFF(now(),cb.ENTRY_DATE) DaysBeforeShipping 
        FROM SEASON season,
             PRODUCT product,
             COMBO_FABRIC cf
        WHERE season.ID = product.ID_SEASON 
        AND cf.ID_PRODUCT = product.ID 
        AND product.ID_MERCHANT = ${idMerchant}
        AND product.ID_SEASON = ${idSeason}`;
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
        pool.query(stringQuery.toUpperCase(), function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getShippingDates({ idMerchant, idSeason, month, year }) {
    let stringQuery =
        `SELECT p.SHIPPING_DATE ShippingDate, p.ENTRY_DATE EntryDate, p.WAREHOUSE_ENTRY_DATE WarehouseDate, 
        pr.NUMBER ProductNumber, pr.ID_TIPOLOGY IdTipology, pr.ID_MERCHANT_BRAND IdBrand, pr.ID_SEASON IdSeason  
        FROM COMBO_FABRIC p INNER JOIN PRODUCT pr ON p.ID_PRODUCT = pr.ID
        INNER JOIN SEASON s ON pr.ID_SEASON = s.ID 
        AND pr.ID_MERCHANT = ${idMerchant} AND MONTH(p.ENTRY_DATE) = ${month} AND YEAR(p.ENTRY_DATE) = ${year}`;
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
        `SELECT I.NAME Description, COUNT(*) ProducsPerSeason 
        FROM PRODUCT P 
        INNER JOIN SAMPLE_TYPE I ON I.ID = P.SAMPLE_TYPE 
        WHERE P.ID_MERCHANT =  ${idMerchant}
        AND P.ID_SEASON = ${idSeason}
        GROUP BY P.SAMPLE_TYPE`;
    return new Promise(function (resolve, reject) {
        pool.query(stringQuery.toUpperCase(), function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}
function getMaterialsSummary(idMerchant, idSeason) {
    let stringQuery = `SELECT f.DESCRIPTION, 
                              f.ID, COUNT(*) AS TOTALPERFABRIC, 
                              f.WEIGHT
                       FROM COMBO_FABRIC cb
                       INNER JOIN PRODUCT p ON cb.ID_PRODUCT = p.ID
                       INNER JOIN FABRIC f ON cb.ID_FABRIC = f.ID
                       WHERE p.ID_SEASON = ${idSeason} AND p.ID_MERCHANT = ${idMerchant}
                       GROUP BY cb.ID_FABRIC, f.DESCRIPTION`;
    return new Promise(function (resolve, reject) {
        pool.query(stringQuery.toUpperCase(), function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}
function getDataForMarginCalculations(idMerchant, idSeason) {
    let stringQuery =
        "SELECT SUM(COST * QUANTITY) as sumCost, SUM(COST_IN_STORE * QUANTITY) as sumCostInStore FROM PRODUCT WHERE ID_SEASON = " +
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
        "select PRODUCT.NAME Name from PRODUCT where PRODUCT.ID_MERCHANT = " +
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

function getFabricsWithPendantStatus(idMerchant, idSeason){
    let stringQuery =`SELECT 
                     FROM PRODUCT P
                     INNER JOIN COMBO_FABRIC CF ON CF.ID_PRODUCT = P.ID
                    
                     WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}`;
return new Promise(function (resolve, reject) {
    pool.query(stringQuery, function (err, rows, fields) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
});

}

function getAviosStatusForBalance(idMerchant, idSeason){
    let stringQuery =`SELECT
    CA.SHIPPING_DATE shippingDate, CA.ID_STATUS idStatus
    FROM PRODUCT P
    INNER JOIN COMBO_AVIO CA ON CA.ID_PRODUCT = P.ID
    WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}
    GROUP BY CA.SHIPPING_DATE, CA.ID_STATUS;`;
return new Promise(function (resolve, reject) {
    pool.query(stringQuery, function (err, rows, fields) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
});

}

function getFabricStatusForBalance(idMerchant, idSeason){
    let stringQuery =`SELECT
    CA.SHIPPING_DATE shippingDate, CA.ID_STATUS idStatus
    FROM PRODUCT P
    INNER JOIN COMBO_FABRIC CA ON CA.ID_PRODUCT = P.ID
    WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}
    GROUP BY CA.SHIPPING_DATE, CA.ID_STATUS;`;
return new Promise(function (resolve, reject) {
    pool.query(stringQuery, function (err, rows, fields) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
});

}

function getAviosStatusForBalance(idMerchant, idSeason){
    let stringQuery =`SELECT
    CA.SHIPPING_DATE shippingDate, CA.ID_STATUS idStatus
    FROM PRODUCT P
    INNER JOIN COMBO_AVIO CA ON CA.ID_PRODUCT = P.ID
    WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}
    GROUP BY CA.SHIPPING_DATE, CA.ID_STATUS;`;
return new Promise(function (resolve, reject) {
    pool.query(stringQuery, function (err, rows, fields) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
});

}

function getSampleStatusForBalance(idMerchant, idSeason){
    let stringQuery =`SELECT
    CA.SHIPPING_DATE shippingDate, P.ID_SAMPLE_STATUS idStatus, P.SAMPLE_TYPE sampleType
    FROM PRODUCT P
    INNER JOIN COMBO_FABRIC CA ON CA.ID_PRODUCT = P.ID
    WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}
    GROUP BY CA.SHIPPING_DATE, P.ID_SAMPLE_STATUS, P.SAMPLE_TYPE;`;
return new Promise(function (resolve, reject) {
    pool.query(stringQuery, function (err, rows, fields) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
});

}

function getFabricColorStatusForBalance(idMerchant, idSeason){
    let stringQuery =`SELECT
    CA.SHIPPING_DATE shippingDate, CFC.ID_STATUS idStatus
    FROM PRODUCT P
    INNER JOIN COMBO_FABRIC CA ON CA.ID_PRODUCT = P.ID
    INNER JOIN COMBO_FABRIC_COLOR CFC ON CFC.ID_COMBO_FABRIC = CA.ID
    WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}
    GROUP BY CA.SHIPPING_DATE, CFC.ID_STATUS;`;
return new Promise(function (resolve, reject) {
    pool.query(stringQuery, function (err, rows, fields) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
});

}

function getFabricPrintStatusForBalance(idMerchant, idSeason){
    let stringQuery =`SELECT
    CA.SHIPPING_DATE shippingDate, CFC.ID_STATUS idStatus
    FROM PRODUCT P
    INNER JOIN COMBO_FABRIC CA ON CA.ID_PRODUCT = P.ID
    INNER JOIN COMBO_FABRIC_PRINT CFC ON CFC.ID_COMBO_FABRIC = CA.ID
    WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}
    GROUP BY CA.SHIPPING_DATE, CFC.ID_STATUS;`;
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
			TIPOLOGY t
    WHERE
			t.ID_CATEGORY = c.ID AND
      t.id = p.id_TIPOLOGY AND
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
        TIPOLOGY t
                                  
      WHERE
        m.ID = ${idMerchant} AND
        s.ID = ${idSeason} AND
        p.ID_SEASON = s.ID AND
        p.ID_TIPOLOGY = t.id AND
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

function getPendantAvios(idSeason, idMerchant) {
    let sqlString = `
    SELECT COUNT(*) cantidadSinAprobar 
    FROM COMBO_AVIO CA
    INNER JOIN PRODUCT P ON CA.ID_PRODUCT = P.ID WHERE P.ID_SEASON = ${idSeason} AND P.ID_MERCHANT = ${idMerchant} AND CA.ID_STATUS = 1 ;
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
function getTotalRequestedModeling(idSeason, idMerchant) {

    let sqlString = `
    SELECT COUNT(*) total
    FROM PRODUCT P 
    WHERE P.ID_SEASON = ${idSeason} AND P.ID_MERCHANT = ${idMerchant} ;
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

function getPendantModeling(idSeason, idMerchant) {
    let sqlString = `
    SELECT COUNT(*) cantidadSinAprobar
    FROM PRODUCT P 
    WHERE P.ID_SEASON = ${idSeason} AND P.ID_MERCHANT = ${idMerchant} AND ID_STATUS_MEASUREMENT_TABLE = 1 ;
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

function getPendantColors(idSeason, idMerchant) {
    let sqlString = ` 
        SELECT COUNT(*) cantidadSinAprobar
        FROM COMBO_FABRIC_COLOR CFC
        INNER JOIN COMBO_FABRIC CF ON CFC.ID_COMBO_FABRIC = CF.ID
        INNER JOIN PRODUCT P ON CF.ID_PRODUCT = P.ID
        WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason} AND CFC.ID_STATUS = 1;`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getPendantPrints(idSeason, idMerchant) {
    let sqlString = ` 
        SELECT COUNT(*) cantidadSinAprobar
        FROM COMBO_FABRIC_COLOR CFC
        INNER JOIN COMBO_FABRIC CF ON CFC.ID_COMBO_FABRIC = CF.ID
        INNER JOIN PRODUCT P ON CF.ID_PRODUCT = P.ID
        WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason} AND CFC.ID_STATUS = 1;`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

async function getPendantColorsAndPrints(idSeason, idMerchant){
    let pendantColors = await getPendantColors(idSeason, idMerchant);
    let pendantPrints = await getPendantPrints(idSeason, idMerchant);
    return (pendantColors[0].cantidadSinAprobar + pendantPrints[0].cantidadSinAprobar) / 2;
}

function getTotalRequestedAvios(idSeason, idMerchant) {
    let sqlString = `SELECT COUNT(*) total 
    FROM COMBO_AVIO_COLOR CAC INNER JOIN COMBO_AVIO CA ON CAC.ID_COMBO_AVIO = CA.ID 
    INNER JOIN PRODUCT P ON CA.ID_PRODUCT = P.ID WHERE P.ID_SEASON = ${idSeason} AND P.ID_MERCHANT = ${idMerchant}`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

async function getTotalRequestedColorsAndPrints(idSeason, idMerchant){
    let pendantColors = await getTotalRequestedColors(idSeason, idMerchant);
    let pendantPrints = await getTotalRequestedPrints(idSeason, idMerchant);
    return (pendantColors[0].total + pendantPrints[0].total) / 2;
}

function getTotalRequestedColors(idSeason, idMerchant) {
    let sqlString = ` 
        SELECT COUNT(*) total
        FROM COMBO_FABRIC_COLOR CFC
        INNER JOIN COMBO_FABRIC CF ON CFC.ID_COMBO_FABRIC = CF.ID
        INNER JOIN PRODUCT P ON CF.ID_PRODUCT = P.ID
        WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason};`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}
function getTotalRequestedPrints(idSeason,idMerchant) {
    let sqlString = ` 
        SELECT COUNT(*) total
        FROM COMBO_FABRIC_COLOR CFC
        INNER JOIN COMBO_FABRIC CF ON CFC.ID_COMBO_FABRIC = CF.ID
        INNER JOIN PRODUCT P ON CF.ID_PRODUCT = P.ID
        WHERE P.ID_MERCHANT = ${idMerchant} AND P.ID_SEASON = ${idSeason}`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getPendantQualities(idSeason, idMerchant) {
    let sqlString = `
        SELECT
            COUNT(CF.ID) cantidadSinAprobar
        FROM
            COMBO_FABRIC CF
        INNER JOIN PRODUCT P on CF.ID_PRODUCT = P.ID
        WHERE
            P.ID_SEASON = ${idSeason} AND
            P.ID_MERCHANT = ${idMerchant} AND
            CF.ID_STATUS = 1
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
function SKUandPieces(idMerchant, idSeason) {
    let sqlString = `
    SELECT I.ID idIndustry, I.DESCRIPTION industryDescription, SUM(P.COST * P.QUANTITY) cost, 
    SUM(P.QUANTITY) quantity FROM 
    PRODUCT P
    INNER JOIN MANAGMENT_UNIT I ON P.ID_MANAGMENT_UNIT = I.ID
    WHERE
        P.ID_SEASON = ${idSeason} AND
        P.ID_MERCHANT = ${idMerchant}
    GROUP BY I.ID, I.DESCRIPTION;`;
    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}//Id_inudstry = IdManagmentUnit /idTipology ES ID INDUSTRY
function getCountCombosForSKUandPieces(idIndustries, idSeason, idMerchant) {
    let sqlString = `
    SELECT P.ID_INDUSTRY IdTipology, P.ID_MANAGMENT_UNIT IdIndustry, COUNT(CFC.ID) comboColorCount, COUNT(CFP.ID) comboPrintCount
    FROM PRODUCT P
    INNER JOIN COMBO_FABRIC CF ON P.ID = CF.ID_PRODUCT
    LEFT JOIN COMBO_FABRIC_COLOR CFC ON CF.ID = CFC.ID_COMBO_FABRIC
    LEFT JOIN COMBO_FABRIC_PRINT CFP ON CF.ID = CFP.ID_COMBO_FABRIC
    WHERE
        P.ID_SEASON = ${idSeason} AND
        P.ID_MERCHANT = ${idMerchant} AND
        P.ID_MANAGMENT_UNIT IN (${idIndustries})
    GROUP BY P.ID_INDUSTRY, P.ID_MANAGMENT_UNIT`;
    
    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {

                return reject(err);
            }

            resolve(rows);
        });
    });
}



function getTipologiesForSKUandPieces(idMerchant, idSeason) {
    let sqlString = `
    SELECT T.ID idTipology, T.DESCRIPTION tipologyDescription, IMU.ID_MANAGMENT_UNIT IdIndustry, 
    SUM(P.COST * P.QUANTITY) cost, SUM(P.QUANTITY) quantity 
    FROM INDUSTRY T 
    INNER JOIN INDUSTRY_MANAGMENT_UNIT IMU ON IMU.ID_INDUSTRY = T.ID
    INNER JOIN PRODUCT P ON P.ID_MANAGMENT_UNIT = IMU.ID_MANAGMENT_UNIT AND T.ID = P.ID_INDUSTRY
    WHERE
        P.ID_SEASON = ${idSeason} AND
        P.ID_MERCHANT = ${idMerchant}
    GROUP BY T.ID, T.DESCRIPTION, IMU.ID;`

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {

                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getTotalRequestedQualities(idSeason, idMerchant) {
    let sqlString = `
        SELECT
        COUNT(CF.ID) total
    FROM
        COMBO_FABRIC CF
    INNER JOIN PRODUCT P on CF.ID_PRODUCT = P.ID
    WHERE
        P.ID_SEASON = ${idSeason} AND
        P.ID_MERCHANT = ${idMerchant}`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function getPiecesByColor(idMerchant, idSeason) {


    let sqlString = `SELECT CAC.ID_COLOR idColor, COUNT(*) pieces, C.DESCRIPTION colorDescription, C.RGB RGB, CAC.ID_SIZE_CURVE, P.SIZE_CURVE_TYPE
    FROM COMBO_FABRIC_COLOR CAC
    INNER JOIN COLOUR C ON CAC.ID_COLOR = C.ID
    INNER JOIN COMBO_FABRIC CA ON CAC.ID_COMBO_FABRIC = CA.ID
    INNER JOIN PRODUCT P ON CA.ID_PRODUCT = P.ID
    WHERE P.ID_SEASON = ${idSeason} AND P.ID_MERCHANT = ${idMerchant}
    GROUP BY CAC.ID_COLOR, C.DESCRIPTION, C.RGB, CAC.ID_SIZE_CURVE, P.SIZE_CURVE_TYPE;`;

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
        let pendantModeling;
        let totalRequestedModeling;

        // Balance, nuevo campo, balance
        getPendantAvios(idSeason, idMerchant).then((result) => {
            pendantAvios = result[0].cantidadSinAprobar;

            getPendantColorsAndPrints(idSeason, idMerchant).then((result) => {
                pendantColorsAndPrints = result;

                getTotalRequestedAvios(idSeason, idMerchant).then((result) => {
                    totalAvios = result[0].total;

                    getTotalRequestedColorsAndPrints(idSeason, idMerchant).then(
                        (result) => {
                            totalRequestedColorsAndPrints = result === 0 ? 1 : result;
                            getPendantQualities(idSeason, idMerchant).then((result) => {
                                pendantQualities = result[0].cantidadSinAprobar;
                                getTotalRequestedQualities(idSeason, idMerchant).then((result) => {
                                    totalRequestedQualities = result[0].total === 0 ? 1 : result[0].total ;
                                    getPendantModeling(idSeason, idMerchant).then((result) => {
                                        pendantModeling = result[0].cantidadSinAprobar;
                                        getTotalRequestedModeling(idSeason, idMerchant).then((result) => {
                                            totalRequestedModeling = result[0].total === 0 ? 1 : result[0].total ;

                                            let percentageAvios = (pendantAvios * 100) / totalAvios;
                                            let percentageColorsAndPrints = (pendantColorsAndPrints * 100) / totalRequestedColorsAndPrints;
                                            let percentageQualities = (pendantQualities * 100) / totalRequestedQualities;
                                            let percentageModeling = (pendantModeling * 100) / totalRequestedModeling;
                                            let resp = {
                                                PercentageAvios: Math.round(percentageAvios),
                                                PercentageColorsAndPrints: Math.round(percentageColorsAndPrints),
                                                PercentageQualities: Math.round(percentageQualities),
                                                PercentageModeling: Math.round(percentageModeling)
                                            };
                                            resolve(resp);
                                        });
                                    });
                                });
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
module.exports.getMaterialsSummary = getMaterialsSummary;
module.exports.getPiecesByColor = getPiecesByColor;
module.exports.getTipologiesForSKUandPieces = getTipologiesForSKUandPieces;
module.exports.SKUandPieces = SKUandPieces;
module.exports.getAviosStatusForBalance = getAviosStatusForBalance;
module.exports.getFabricStatusForBalance = getFabricStatusForBalance;
module.exports.getFabricColorStatusForBalance = getFabricColorStatusForBalance;
module.exports.getFabricPrintStatusForBalance = getFabricPrintStatusForBalance;
module.exports.getSampleStatusForBalance = getSampleStatusForBalance;
module.exports.getCountCombosForSKUandPieces = getCountCombosForSKUandPieces;