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
                        tipology`;

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
                        product p, merchant m
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
                        product`;

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
                        shipping_type`;

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
                          department`;

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
function getTipologies(idMerchant) {
    let sqlString = `SELECT
                          id IdTipology,
                          description Description
                      FROM
                          tipology`;

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
    product p,season s, department_merchant dm, tipology t, status st, 
    product_picture pp,  merchant m, supplier_merchant sm, supplier supp, department d, designer des
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
    idTipology,
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
  p.ID IdProduct,
  p.NAME ProductoNombre,
  p.QUANTITY Cantidad,
  p.cost Costo,
  p.cost_in_store Precio,
  round(((p.cost_in_store/1.22 - p.cost)/(p.cost_in_store/1.22)*100), 2) Margin,
  p.WEIGHT Peso,
  pp.PATH Foto,
  supp.NAME Proveedor,
  d.DESCRIPTION Departamento,
  t.DESCRIPTION Tipo,
  MIN(f.DESCRIPTION) Calidad,
  COUNT(f.DESCRIPTION) -1 CalidadesAdicionales,
  st.DESCRIPTION Estado
  FROM
  product p
          INNER JOIN product_fabric pf on p.id = pf.ID_PRODUCT
          INNER JOIN fabric f on f.ID = pf.id_fabric 
          INNER JOIN department d ON p.ID_DEPARTMENT = d.ID
          INNER JOIN designer des ON p.ID_DESIGNER = des.ID 
          INNER JOIN tipology t ON t.ID = p.ID_TIPOLOGY 
          INNER JOIN season s ON s.ID = p.ID_SEASON 
          INNER JOIN supplier supp ON supp.ID = p.ID_SUPPLIER
          INNER JOIN status ST ON st.ID = p.ID_STATUS
          LEFT OUTER JOIN product_picture pp on pp.ID_PRODUCT = p.ID and pp.IS_MAIN = 1
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

            sqlString += ` AND pf.ID_FABRIC in (${result})`;
        } else {
            sqlString += ` AND pf.ID_FABRIC = ${idFabric}`;
        }
    }
    if (idDepartment != "nofilter") {
        if (idDepartment.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idDepartment.split(search).join(replaceWith);

            sqlString += ` AND d.ID in (${result})`;
        } else {
            sqlString += ` AND d.ID = ${idDepartment}`;
        }
    }
    if (idSupplier != "nofilter") {
        if (idSupplier.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idSupplier.split(search).join(replaceWith);

            sqlString += ` AND supp.ID in (${result})`;
        } else {
            sqlString += ` AND supp.ID = ${idSupplier}`;
        }
    }
    if (idTipology != "nofilter") {
        if (idTipology.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idTipology.split(search).join(replaceWith);

            sqlString += ` AND t.ID in (${result})`;
        } else {
            sqlString += ` AND t.ID = ${idTipology}`;
        }
    }
    if (idStatus != "nofilter") {
        if (idStatus.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idStatus.split(search).join(replaceWith);

            sqlString += ` AND st.ID in (${result})`;
        } else {
            sqlString += ` AND st.ID = ${idStatus}`;
        }
    }
    if (ProductName != "nofilter") {
        sqlString += ` AND p.NAME like '%${ProductName}%'`;
    }
    if (ProductPrice != "nofilter") {
        sqlString += ` AND p.COST = '${ProductPrice}'`;
    }
    if (ProductWeight != "nofilter") {
        sqlString += ` AND p.WEIGHT = '${ProductWeight}'`;
    }

    if (shippingDate != "nofilter") {
        sqlString += ` AND p.shipping_date = '${shippingDate}'`;
    }

    if (quantity != "nofilter") {
        sqlString += ` AND p.Quantity = '${quantity}'`;
    }

    if (shippingDate != "nofilter") {
        sqlString += ` AND p.shipping_date = '${shippingDate}'`;
    }

    if (idOrigin != "nofilter") {
        if (idOrigin.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idOrigin.split(search).join(replaceWith);
            sqlString += ` AND p.ID_COUNTRY in (${result})`;
        } else {
            sqlString += ` AND p.ID_COUNTRY = ${idOrigin}`;
        }
    }
    if (idDestination != "nofilter") {
        if (idDestination.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idDestination.split(search).join(replaceWith);
            sqlString += ` AND p.ID_COUNTRY_DESTINATION in (${result})`;
        } else {
            sqlString += ` AND p.ID_COUNTRY_DESTINATION = ${idDestination}`;
        }
    }

    if (idShippingType != "nofilter") {
        if (idShippingType.includes("&")) {
            const search = "&";
            const replaceWith = ",";
            const result = idShippingType.split(search).join(replaceWith);
            sqlString += ` AND p.id_shipping in (${result})`;
        } else {
            sqlString += ` AND p.id_shipping = ${idShippingType}`;
        }
    }

    sqlString += ` GROUP BY p.ID, p.NAME, p.QUANTITY, p.cost, p.WEIGHT, pp.PATH, supp.NAME, d.DESCRIPTION, t.DESCRIPTION, st.DESCRIPTION ORDER BY P.id desc`;

    return new Promise(function (resolve, reject) {
        pool.query(sqlString, function (err, rows, fields) {
            if (err) {
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
