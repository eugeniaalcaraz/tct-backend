const pool = require("../configuration/ConfigurationDB");
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
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
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
                return reject("error" + err);
            }
            resolve(rows);
        });
    });
}

function getAllProductsWithFilters(
    idMerchant,
    idSeason,
    idDesigner,
    idFabric,
    idDepartment,
    idSupplier,
    idTIPOLOGY,
    idStatus,
    ProductName,
    ProductPrice,
    ProductWeight,
    idOrigin,
    idDestination,
    idShippingType,
    shippingDate,
    quantity
) {
    let sqlString = `SELECT
    P.ID IdProduct,
    P.NAME ProductoNombre,
    P.QUANTITY Cantidad,
    P.COST Costo,
    P.COST_IN_STORE Precio,
    ROUND(((P.COST_IN_STORE/1.22 - P.COST)/(P.COST_IN_STORE/1.22)*100), 2) Margin,
    P.WEIGHT Peso,
    PP.PATH Foto,
    SUPP.NAME Proveedor,
    D.DESCRIPTION Departamento,
    T.NAME Tipo,
    MIN(F.DESCRIPTION) Calidad,
    COUNT(F.DESCRIPTION) - 1 CalidadesAdicionales,
    ST.NAME Estado
    FROM
    PRODUCT P
    INNER JOIN COMBO_FABRIC COMF ON P.ID = COMF.ID_PRODUCT
    INNER JOIN FABRIC F ON F.ID = COMF.ID_FABRIC
    INNER JOIN DEPARTMENT D ON P.ID_DEPARTMENT = D.ID
    INNER JOIN DESIGNER DES ON P.ID_DESIGNER = DES.ID
    INNER JOIN TIPOLOGY T ON T.ID = P.ID_TIPOLOGY
    INNER JOIN SEASON S ON S.ID = P.ID_SEASON
    INNER JOIN SUPPLIER SUPP ON SUPP.ID = P.ID_SUPPLIER
    INNER JOIN STATUS ST ON ST.ID = P.ID_STATUS
    LEFT OUTER JOIN PRODUCT_PICTURE PP ON PP.ID_PRODUCT = P.ID AND PP.IS_MAIN = 1
    WHERE 1 = 1`;

    if (idSeason != "nofilter") {
        if (idSeason.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idSeason.split(search).join(replaceWith);

            sqlString += ` AND s.ID in (${result})`;
        } else {
            sqlString += ` AND s.ID = ${idSeason}`;
        }
    }
    if (idDesigner != "nofilter") {
        if (idDesigner.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idDesigner.split(search).join(replaceWith);

            sqlString += ` AND des.ID in (${result})`;
        } else {
            sqlString += ` AND des.ID = ${idDesigner}`;
        }
    }
    if (idFabric != "nofilter") {
        if (idFabric.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idFabric.split(search).join(replaceWith);

            sqlString += ` AND COMF.ID_FABRIC in (${result})`;
        } else {
            sqlString += ` AND COMF.ID_FABRIC = ${idFabric}`;
        }
    }
    if (idDepartment != "nofilter") {
        if (idDepartment.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idDepartment.split(search).join(replaceWith);

            sqlString += ` AND D.ID in (${result})`;
        } else {
            sqlString += ` AND D.ID = ${idDepartment}`;
        }
    }
    if (idSupplier != "nofilter") {
        if (idSupplier.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idSupplier.split(search).join(replaceWith);

            sqlString += ` AND SUPP.ID in (${result})`;
        } else {
            sqlString += ` AND SUPP.ID = ${idSupplier}`;
        }
    }
    if (idTIPOLOGY != "nofilter") {
        if (idTIPOLOGY.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idTIPOLOGY.split(search).join(replaceWith);

            sqlString += ` AND T.ID in (${result})`;
        } else {
            sqlString += ` AND T.ID = ${idTIPOLOGY}`;
        }
    }
    if (idStatus != "nofilter") {
        if (idStatus.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idStatus.split(search).join(replaceWith);

            sqlString += ` AND ST.ID in (${result})`;
        } else {
            sqlString += ` AND ST.ID = ${idStatus}`;
        }
    }
    if (ProductName != "nofilter") {
        sqlString += ` AND P.NAME like '%${ProductName}%'`;
    }
    if (ProductPrice != "nofilter") {
        sqlString += ` AND P.COST = '${ProductPrice}'`;
    }
    if (ProductWeight != "nofilter") {
        sqlString += ` AND P.WEIGHT = '${ProductWeight}'`;
    }

    if (shippingDate != "nofilter") {
        sqlString += ` AND P.shipping_date = '${shippingDate}'`;
    }

    if (quantity != "nofilter") {
        sqlString += ` AND P.Quantity = '${quantity}'`;
    }

    if (shippingDate != "nofilter") {
        sqlString += ` AND P.shipping_date = '${shippingDate}'`;
    }

    if (idOrigin != "nofilter") {
        if (idOrigin.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idOrigin.split(search).join(replaceWith);
            sqlString += ` AND P.ID_COUNTRY in (${result})`;
        } else {
            sqlString += ` AND P.ID_COUNTRY = ${idOrigin}`;
        }
    }
    if (idDestination != "nofilter") {
        if (idDestination.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idDestination.split(search).join(replaceWith);
            sqlString += ` AND P.ID_COUNTRY_DESTINATION in (${result})`;
        } else {
            sqlString += ` AND P.ID_COUNTRY_DESTINATION = ${idDestination}`;
        }
    }

    if (idShippingType != "nofilter") {
        if (idShippingType.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idShippingType.split(search).join(replaceWith);
            sqlString += ` AND P.id_shipping in (${result})`;
        } else {
            sqlString += ` AND P.id_shipping = ${idShippingType}`;
        }
    }

    sqlString += ` GROUP BY P.ID, P.NAME, P.QUANTITY, P.cost, P.WEIGHT, PP.PATH, SUPP.NAME, D.DESCRIPTION, T.NAME, ST.NAME ORDER BY P.ID desc`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
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
