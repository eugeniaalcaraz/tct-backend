const con = require("../configuration/ConfigurationDB");
const dtoFilters = require("../../DataTransferObject/dtoFilters");

//obtengo datos para llenar los combos
function getSeasons(idMerchant) {
    let sqlString = `SELECT
    S.ID IdSeason,
    S.NAME SeasonName
FROM
    SEASON S,
    MERCHANT M
WHERE
    M.ID = S.ID_MERCHANT AND
    M.ID = ${idMerchant} AND
    S.ID <> 0
`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }

            resolve(rows);
        });
    });
}

//SUPPLIERS
function getSupplierName(idMerchant) {
    let sqlString = `select s.ID, s.NAME from supplier s, merchant m, supplier_merchant sm where s.ID = sm.ID_SUPPLIER and sm.ID_MERCHANT = m.ID and m.id = ${idMerchant}`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }

            resolve(rows);
        });
    });
}

//DESIGNERS
function getDesigners(idMerchant) {
    let sqlString = `SELECT
                        D.ID IdDesigner,
                        D.NAME DesignerName,
                        D.LAST_NAME DesignerLastName,
                        D.ID_USER IdUser
                    FROM
                        DESIGNER D,
                        MERCHANT M
                    WHERE
                        M.ID = D.ID_MERCHANT AND
                        D.ID_MERCHANT = ${idMerchant} AND
                        D.ACTIVE = 1`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//ORIGINS AND DESTINATIONS
// function getOrigins() {
//     let sqlString = `SELECT DISTINCT
//                         ID_COUNTRY
//                     FROM
//                         PRODUCT`;

// return new Promise(function (resolve, reject) {
//     pool.query(sqlString, function (err, rows, fields) {
//         if (err) {
//         return reject("error" + err);
//         }
//         resolve(rows);
//     });
//     });
//     // pool.query(sqlString, function (err, rows, fields) {
//     // if (err) {
//     //     throw err;
//     // }

//     // return rows;

//     // });

// }

function getCountryName(idCountry) {
    let sqlString = `SELECT
                        id IdCountry, 
                        name CountryName
                    FROM
                        country
                    WHERE
                        id = ${idCountry}`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

function getCountries(idMerchant) {
    let sqlString = `SELECT
                        id IdCountry, 
                        name CountryName
                    FROM
                        country`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

function getOrigins(arrayContryId) {
    let listOrigins = [];
    arrayContryId.forEach((element) => {
        let countryName = getCountryName(element);
        let country = { id: element, name: countryName };
        listOrigins.push(country);
    });

    return listOrigins;
}

function getAllOrigins(idMerchant) {
    let sqlString = `SELECT 
                        id,
                        name
                    FROM
                        country`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//GARMENT TYPE
function getGarmentTypes(idMerchant) {
    let sqlString = `SELECT
                        id IdGarmentType, 
                        description Description
                    FROM
                        TIPOLOGY`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//PRODUCT NAME
function getProductsNames(idMerchant) {
    let sqlString = `SELECT 
                        id p.IdProduct,
                        name p.ProductName
                    FROM
                        PRODUCT p, merchant m
                    WHERE
                        p.id_merchant = m.id`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//PRODUCT_SKU
function getProductBysku(productSKU) {
    let sqlString = `SELECT 
                        id_product
                    FROM
                        product_sku
                    WHERE
                         SKU =  ${productSKU}`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//SHIPMENT TYPE
function getShipmentType(idMerchant) {
    let sqlString = `SELECT 
                        id,
                        description
                    FROM
                        shipment_type`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//STATUS
function getStatus(idMerchant) {
    let sqlString = `SELECT 
                        id IdStatus,
                        description Description
                    FROM
                        status
                    WHERE
                        id <>0`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//WEIGHT
function getWeight(idMerchant) {
    let sqlString = `SELECT DISTINCT
                        weight
                    FROM
                        PRODUCT`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//QUALITY (FABRIC)
function getQuality(idMerchant) {
    let sqlString = `SELECT
                        f.id IdFabric,
                        f.description Description
                    FROM
                        fabric f, merchant m
                    WHERE
                        f.id_merchant = m.id
                        and f.id_merchant = ${idMerchant}`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

//SHIPPING TYPE
function getShippingTypes(idMerchant) {
    let sqlString = `SELECT
                        id IdShippingType,
                        description Description
                    FROM
                        SHIPPING_TYPE`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
        //con.releaseConnection();
    });
}

//DEPARTMENT
function getDepartments(idMerchant) {
    let sqlString = `SELECT
                          id IdDepartment,
                          description Description
                      FROM
                          DEPARTMENT`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                console.log(err);
                return reject("error" + err);
            }
            resolve(rows);
        });
        //con.releaseConnection();
    });
}

//DEPARTMENT
function getTipologies(idMerchant) {
    let sqlString = `SELECT
                          id IdTIPOLOGY,
                          description Description
                      FROM
                      TIPOLOGY`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
        //con.releaseConnection();
    });
}


function getDetailForListing(idProduct) {
    let sqlString = ` SELECT DISTINCT
    StatProd.NAME statusProduct,
    StatFab.NAME statusFabric,
    CF2.STATUS_DATE statusFabricDate,
    StatAvio.NAME statusAvio,
    CA2.STATUS_DATE statusAvioDate,
    StatModeling.NAME statusModeling,
    P.MODELING_DATE statusModelingDate,
    StatSample.NAME statusSample,
    P.SAMPLE_DATE statusSampleDate,
    CF2.IdComboFabric idComboFabric,
    CF2.ShippingType shippingType,
    CF2.max_shipping_date shippingDate,
    CF2.ENTRY_DATE entryDate,
    CF2.WAREHOUSE_ENTRY_DATE warehouseEntryDate,
    CF2.ID_FABRIC idFabric
FROM
    PRODUCT P
    INNER JOIN STATUS StatProd ON P.ID_STATUS = StatProd.ID
    INNER JOIN (
        SELECT CF.ID_PRODUCT, 
        CF.ID_FABRIC,
        CF.ID_STATUS, 
        CF.STATUS_DATE, 
        MAX(CF.SHIPPING_DATE) AS max_shipping_date, 
        MAX(CF.ENTRY_DATE) AS ENTRY_DATE, 
        MAX(CF.WAREHOUSE_ENTRY_DATE) AS WAREHOUSE_ENTRY_DATE, 
        ST.NAME as ShippingType,
        CF.ID as IdComboFabric
        FROM COMBO_FABRIC CF
        INNER JOIN SHIPPING_TYPE ST ON CF.ID_SHIPPING = ST.ID
        GROUP BY CF.ID_PRODUCT, CF.ID_STATUS, CF.STATUS_DATE, ST.NAME, CF.ID_FABRIC, CF.ID
    ) CF2 ON P.ID = CF2.ID_PRODUCT 
    INNER JOIN STATUS StatFab ON CF2.ID_STATUS = StatFab.ID
    LEFT OUTER JOIN (
        SELECT CA.ID_PRODUCT, 
        CA.ID_STATUS, 
        CA.STATUS_DATE, MAX(CA.SHIPPING_DATE) AS max_shipping_date
        FROM COMBO_AVIO CA
        GROUP BY CA.ID_PRODUCT, CA.ID_STATUS, CA.STATUS_DATE
    ) CA2 ON P.ID = CA2.ID_PRODUCT
    LEFT JOIN STATUS StatAvio ON CA2.ID_STATUS = StatAvio.ID
    LEFT JOIN STATUS StatModeling ON P.ID_MODELING_STATUS = StatModeling.ID
    LEFT JOIN STATUS StatSample ON P.ID_SAMPLE_STATUS = StatSample.ID
    WHERE P.ID = ${idProduct}`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
        //con.releaseConnection();
    });
}
//OBTENGO DATOS PARA DEVOLVER LISTADO

//PICTURE
function getProductPicture(idMerchant, idProduct) {
    let sqlString = `SELECT
                        PP.ID,
                        PP.PATH
                    FROM
                        PRODUCT P,
                        PRODUCT_PICTURE PP,
                        merchant m
                    WHERE
                        P.ID = PP.ID_PRODUCT AND
                        P.ID = ${idProduct}`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }

            resolve(rows);
        });
    });
}

function getAllProducts(idMerchant, idSeason) {
    let sqlString = `SELECT
    p.ID producto_id,
    p.NAME producto_nombre,
    p.QUANTITY cantidad,
    p.COST precio,
    p.WEIGHT peso,
    pp.PATH foto,
    supp.NAME proveedor,
    d.DESCRIPTION departamento,
    t.DESCRIPTION tipo,
    f.DESCRIPTION calidad,
    st.DESCRIPTION estado
    FROM
    PRODUCT p,season s, department_merchant dm, TIPOLOGY t, status st, 
    product_picture pp,  merchant m, supplier_merchant sm, supplier supp, department d, DESIGNER des
    where p.ID_SEASON = s.ID
    and dm.ID_DEPARTMENT = d.ID
    AND p.ID_MERCHANT = dm.ID_MERCHANT
    AND p.ID_DESIGNER = des.ID
    and p.ID_TIPOLOGY = t.ID
    and p.ID_STATUS = st.ID
    and p.ID_MERCHANT = m.ID
    and p.ID = pp.ID_PRODUCT
    and sm.ID_SUPPLIER = s.ID 
    AND sm.ID_MERCHANT = m.ID
    AND s.ID = ${idSeason}`;

    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

function getAllProductsWithFilters(
    idMerchant,idSeason,idBrand,idManagmentUnit,idIndustry,
    idTipology,idConcept,idLine,idBodyFit,entryDate,warehouseEntryDate,storeDate,idShippingType,idFabric,prodName
) {
    console.log("hola listado")
    let sqlString = `
    SELECT DISTINCT
        P.ID idProduct,
        P.Number productNumber,
        P.ID_SEASON idSeason,
        CONCAT(S.NAME, ' ', S.LASTNAME) AS supplier,
        P.NAME name,
        L.DESCRIPTION line,
        MU.DESCRIPTION managmentUnit,
        I.DESCRIPTION industry,
        T.NAME tipology,
        T.ID idTipology,
        MBF.DESCRIPTION bodyFit,
        StatProd.NAME statusProduct,
        StatFab.NAME statusFabric,
        CF2.STATUS_DATE statusFabricDate,
        StatAvio.NAME statusAvio,
        CA2.STATUS_DATE statusAvioDate,
        StatModeling.NAME statusModeling,
        P.MODELING_DATE statusModelingDate,
        StatSample.NAME statusSample,
        P.SAMPLE_DATE statusSampleDate,
        C.DESCRIPTION concept,
        CF2.IdComboFabric idComboFabric,
        CF2.ShippingType shippingType,
        CF2.max_shipping_date shippingDate,
        CF2.ENTRY_DATE entryDate,
        CF2.WAREHOUSE_ENTRY_DATE warehouseEntryDate,
        MB.NAME brand,
        P.YEAR year,
        P.COST cost,
        P.COST_IN_STORE costInStore,
        P.QUANTITY quantity,
        CF2.ID_FABRIC idFabric,
        PP.PATH pic
    FROM
        PRODUCT P
        LEFT OUTER JOIN PRODUCT_PICTURE PP ON P.ID = PP.ID_PRODUCT
        INNER JOIN SUPPLIER S ON P.ID_SUPPLIER = S.ID 
        INNER JOIN LINE L ON P.ID_LINE = L.ID
        INNER JOIN MANAGMENT_UNIT MU ON MU.ID = P.ID_MANAGMENT_UNIT
        INNER JOIN INDUSTRY I ON P.ID_INDUSTRY = I.ID 
        INNER JOIN TIPOLOGY T ON P.ID_TIPOLOGY = T.ID
        INNER JOIN MERCHANT_BODY_FIT MBF ON P.ID_MERCHANT = MBF.ID_MERCHANT AND P.ID_BODY_FIT = MBF.ID
        INNER JOIN COMBO_FABRIC CF ON P.ID = CF.ID_PRODUCT
        INNER JOIN STATUS StatProd ON P.ID_STATUS = StatProd.ID
        INNER JOIN CONCEPT C ON P.ID_CONCEPT = C.ID
        INNER JOIN MERCHANT_BRAND MB ON P.ID_MERCHANT_BRAND = MB.ID
        INNER JOIN (
            SELECT CF.ID_PRODUCT, 
            CF.ID_FABRIC,
            CF.ID_STATUS, 
            CF.STATUS_DATE, 
            MAX(CF.SHIPPING_DATE) AS max_shipping_date, 
            MAX(CF.ENTRY_DATE) AS ENTRY_DATE, 
            MAX(CF.WAREHOUSE_ENTRY_DATE) AS WAREHOUSE_ENTRY_DATE, 
            ST.NAME as ShippingType,
            CF.ID as IdComboFabric
            FROM COMBO_FABRIC CF
            INNER JOIN SHIPPING_TYPE ST ON CF.ID_SHIPPING = ST.ID
            GROUP BY CF.ID_PRODUCT, CF.ID_STATUS, CF.STATUS_DATE, ST.NAME, CF.ID_FABRIC, CF.ID
        ) CF2 ON P.ID = CF2.ID_PRODUCT 
        INNER JOIN STATUS StatFab ON CF2.ID_STATUS = StatFab.ID
        LEFT OUTER JOIN (
            SELECT CA.ID_PRODUCT, 
            CA.ID_STATUS, 
            CA.STATUS_DATE, MAX(CA.SHIPPING_DATE) AS max_shipping_date
            FROM COMBO_AVIO CA
            GROUP BY CA.ID_PRODUCT, CA.ID_STATUS, CA.STATUS_DATE
        ) CA2 ON P.ID = CA2.ID_PRODUCT
        LEFT JOIN STATUS StatAvio ON CA2.ID_STATUS = StatAvio.ID
        LEFT JOIN STATUS StatModeling ON P.ID_MODELING_STATUS = StatModeling.ID
        LEFT JOIN STATUS StatSample ON P.ID_SAMPLE_STATUS = StatSample.ID

        `
    ;

    if (entryDate != "nofilter") {
        sqlString += ` INNER JOIN (
            SELECT CFED.ENTRY_DATE, CFED.ID_PRODUCT
            FROM COMBO_FABRIC CFED
            GROUP BY CFED.ID_PRODUCT,  CFED.ENTRY_DATE ) CFEDTABLE ON CFEDTABLE.ENTRY_DATE = '${entryDate}'`;
    }
    if (warehouseEntryDate != "nofilter") {
        sqlString += ` INNER JOIN (
            SELECT CFED2.WAREHOUSE_ENTRY_DATE, CFED2.ID_PRODUCT
            FROM COMBO_FABRIC CFED2
            GROUP BY CFED2.ID_PRODUCT,  CFED2.WAREHOUSE_ENTRY_DATE ) CFED2TABLE ON CFED2TABLE.WAREHOUSE_ENTRY_DATE = '${warehouseEntryDate}'`;
    }
    if (storeDate != "nofilter") {
        sqlString += ` INNER JOIN (
            SELECT CFED3.SHIPPING_DATE, CFED3.ID_PRODUCT
            FROM COMBO_FABRIC CFED3
            GROUP BY CFED3.ID_PRODUCT,  CFED3.SHIPPING_DATE ) CFED3TABLE ON CFED3TABLE.SHIPPING_DATE = '${storeDate}'`;
    }
    if (idShippingType != "nofilter") {
        sqlString += ` INNER JOIN (
            SELECT CFSHIP.ID_SHIPPING, CFSHIP.ID_PRODUCT
            FROM COMBO_FABRIC CFSHIP
            GROUP BY CFSHIP.ID_PRODUCT,  CFSHIP.ID_SHIPPING ) SHIPTABLE ON SHIPTABLE.ID_SHIPPING = ${idShippingType}`;
    }
    sqlString += ` WHERE P.ID_MERCHANT = ${idMerchant} `;
    //sqlString += `WHERE P.ID_MERCHANT = ${idMerchant}`
    if (prodName != "nofilter") {
        let newName = prodName.replace('%', ' ');
        sqlString += ` AND P.NAME LIKE '%${newName}%' `;
    }
    if (idSeason != "nofilter") {
        sqlString += ` AND P.ID_SEASON = ${idSeason} `;
    }
    if (idBrand != "nofilter") {
        sqlString += ` AND P.ID_MERCHANT_BRAND = ${idBrand}`;
    }
    if (idLine != "nofilter") {
        sqlString += ` AND P.ID_LINE = ${idLine}`;
    }
    if (idManagmentUnit != "nofilter") {
        sqlString += ` AND P.ID_MANAGMENT_UNIT = ${idManagmentUnit}`;
    }
    if (idIndustry != "nofilter") {
        sqlString += ` AND P.ID_INDUSTRY = ${idIndustry}`;
    }
    if (idTipology != "nofilter") {
        sqlString += ` AND P.ID_TIPOLOGY = ${idTipology}`;
    }
    if (idBodyFit != "nofilter") {
        sqlString += ` AND P.ID_BODY_FIT = ${idBodyFit}`;
    }
    if (idFabric != "nofilter") {
        sqlString += ` AND CF.ID_FABRIC = ${idFabric}`;
    }
    if (idConcept != "nofilter") {
        sqlString += ` AND C.ID = ${idConcept}`;
    }

    console.log(sqlString)
    return new Promise(function (resolve, reject) {
        con.query(sqlString, function (err, rows, fields) {
            if (err) {
                console.log(err);
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

module.exports.getSeasons = getSeasons;
module.exports.getSupplierName = getSupplierName;
module.exports.getDesigners = getDesigners;
module.exports.getCountryName = getCountryName;
module.exports.getGarmentTypes = getGarmentTypes;
module.exports.getShipmentType = getShipmentType;
module.exports.getStatus = getStatus;
module.exports.getWeight = getWeight;
module.exports.getQuality = getQuality;
module.exports.getProductPicture = getProductPicture;
module.exports.getAllProducts = getAllProducts;
module.exports.getAllProductsWithFilters = getAllProductsWithFilters;
module.exports.getShippingTypes = getShippingTypes;
module.exports.getProductsNames = getProductsNames;
module.exports.getCountries = getCountries;
module.exports.getTipologies = getTipologies;
module.exports.getDepartments = getDepartments;
module.exports.getDetailForListing = getDetailForListing;
