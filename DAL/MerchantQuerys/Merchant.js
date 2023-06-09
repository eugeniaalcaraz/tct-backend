const { Console } = require("console");
const { on } = require("events");
const con = require("../configuration/ConfigurationDB");
const util = require("util");
const { get } = require("http");
const { start } = require("repl");

function getMerchant({ idMerchant }) {
  let stringQuery = `SELECT * FROM merchant where id = ${idMerchant}`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function startTransaction() {
  let stringQuery = "START TRANSACTION";
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// function commit(){
//     let stringQuery = "COMMIT";
//     return new Promise(function(resolve, reject) {
//         con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
//              if (err) {
//                  return reject(err);
//              }
//             resolve(rows);
//         });
//     });
// }

function getMerchantSeason({ idMerchant, idSeason }) {
  let stringQuery =
    "SELECT m.ID Id, m.FANTASY_NAME FantasyName, m.ASSOCIATION_DATE AssociationDate, m.RUT RUT, m.ID_COUNTRY IdCountry, s.ID IdSeason, s.NAME Name, s.START_DATE StartDate, s.END_DATE EndDate, s.CODE Code FROM MERCHANT m INNER JOIN SEASON s on m.ID = s.ID_MERCHANT where s.ID = " +
    idSeason +
    " and s.ID_MERCHANT = " +
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

function getMerchantDepartment({ idMerchant, idDepartment }) {
  let stringQuery =
    "select * from SEASON s inner join SEASON_DEPARTMENT sd on s.id = sd.ID_SEASON where s.ID_MERCHANT = " +
    idMerchant +
    " and sd.id_department = " +
    idDepartment;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getMerchantManagmentUnits({ idMerchant }) {
  let stringQuery =
  `SELECT ID Id, DESCRIPTION Description FROM MANAGMENT_UNIT WHERE ID_MERCHANT = ${idMerchant}`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getMerchantIndustries({ idMerchant, idManagmentUnit }) {
    let stringQuery =
    `SELECT ind.ID Id, ind.DESCRIPTION Description FROM INDUSTRY ind INNER JOIN INDUSTRY_MANAGMENT_UNIT indManagUnit on
    ind.ID = indManagUnit.ID_INDUSTRY WHERE ind.ID_MERCHANT = ${idMerchant} AND indManagUnit.ID_MANAGMENT_UNIT = ${idManagmentUnit}`;
    console.log(stringQuery.toUpperCase())
    return new Promise(function (resolve, reject) {
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

function getMerchantSeasons({ idMerchant }) {
  let stringQuery =
    "SELECT ID Id, NAME Name FROM SEASON WHERE ID_MERCHANT = " + idMerchant;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getMerchantSuppliers({ idMerchant }) {
  let stringQuery =
    `SELECT sup.ID Id, sup.NAME Name, sup.LASTNAME Lastname FROM SUPPLIER sup 
    INNER JOIN SUPPLIER_MERCHANT supMerchant on sup.ID = supMerchant.ID_SUPPLIER WHERE supMerchant.ID_MERCHANT = ${idMerchant}`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getMerchantDesigners({ idMerchant }) {
  let stringQuery =
    "SELECT ID Id, NAME Name, LAST_NAME LastName FROM DESIGNER WHERE ACTIVE = 1 AND ID_MERCHANT =" +
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

function getCountries() {
  let stringQuery = "SELECT ID Id, NAME Name FROM COUNTRY";
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getTipologies(IdMerchant, idIndustry) {
  let stringQuery = `SELECT ID Id, NAME Description, CODE Code, WEIGHT Weight FROM TIPOLOGY WHERE ID_INDUSTRY = ${idIndustry}`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

  
function getFibers() {
  let stringQuery = "SELECT ID Id, DESCRIPTION Description FROM FIBER";
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getColors() {
  let stringQuery = `SELECT ID Id, DESCRIPTION Description, CODE Code, RGB RGB FROM COLOUR`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getTrims() {
  let stringQuery = `SELECT ID Id, DESCRIPTION Description FROM AVIO`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getMerchantLines(idMerchant) {
    let stringQuery = `SELECT ID Id, DESCRIPTION Description FROM LINE WHERE ID_MERCHANT = ${idMerchant}`;
    return new Promise(function (resolve, reject) {
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  
function getMerchantBodyFit(idMerchant) {
    let stringQuery = `SELECT ID Id, DESCRIPTION Description FROM MERCHANT_BODY_FIT WHERE ID_MERCHANT = ${idMerchant}`;
    return new Promise(function (resolve, reject) {
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }


function getPlacements() {
  let stringQuery = "SELECT ID Id, DESCRIPTION Description FROM PLACEMENT";
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getShippingTypes() {
  let stringQuery = "SELECT ID Id, NAME Description FROM SHIPPING_TYPE";
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function findCollection(idCollection, idMerchant) {
  let stringQuery =
    "select * from SEASON s inner join MERCHANT m on s.id_merchant = m.id inner join COLLECTION c on c.ID_SEASON = s.id where m.ID = " +
    idMerchant;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function findShippingType(idShippingType) {
  let stringQuery = "select * from SHIPPING_TYPE where id = " + idShippingType;

  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function findCountry(idCountry) {
  let stringQuery = "select * from COUNTRY where id = " + idCountry;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function findTIPOLOGY(idTIPOLOGY) {
  let stringQuery = "select * from TIPOLOGY where id = " + idTIPOLOGY;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
function findStatus(idStatus) {
  let stringQuery = "select * from STATUS where id = " + idStatus;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function findShippingType(idShippingType) {
  let stringQuery = "select * from SHIPPING_TYPE where id = " + idShippingType;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
function findFabric(fabricIds, idMerchant) {
  let stringQuery =
    "SELECT id_fabric FROM PERCENTAGE_FIBER pf inner join FABRIC f on  pf.id_fabric = f.id where id_fiber in ( " +
    fabricIds +
    ") and f.id_merchant = " +
    idMerchant +
    " group by id_fabric having count(id_fabric) > 1 ";
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getFabricFromId(idFabric, idMerchant) {
  let stringQuery =`select * from fabric where id = ${idFabric} and ID_MERCHANT = ${idMerchant}`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }

      resolve(rows);
    });
  });
}

async function getFabrics(idMerchant) {
  console.log("hi")
  let stringQuery =
    "SELECT ID Id, DESCRIPTION Description, WEIGHT Weight, ID_MERCHANT IdMerchant FROM FABRIC WHERE ID_MERCHANT = " +
    idMerchant +
    " AND DESCRIPTION <> 'PendingDescription'";

  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function getFabricComposition(idFabric) {
  let stringQuery =
    "select f.DESCRIPTION Description, pf.PERCENTAGE Percentage from PERCENTAGE_FIBER pf inner join FIBER f on pf.ID_FIBER = f.ID where pf.ID_FABRIC = " +
    idFabric;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function findFibers(fiberIds) {
  let stringQuery = `select * from fiber where id in (${fiberIds})`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
function getFabric(description, weight) {
  let stringQuery = `SELECT * FROM FABRIC WHERE DESCRIPTION = '${description}' AND WEIGHT = ${weight}`;

  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }

      resolve(rows);
    });
  });
}

function saveNewFabric(idMerchant, description, weight) {
  let idFab;
  return new Promise(function (resolve, reject) {
    getFabric(description, weight).then((res) => {
      if (res.length > 0) {//Si ya existe, devuelve el id existente
        idFab = res[0].ID;
        resolve(idFab);
      } else {
        insertFabric(description, weight, idMerchant).then((res) => {
          idFab = res;
          resolve(idFab);
        });
      }
    });
  });
}

function insertFabric(description, weight, idMerchant) {
  return new Promise(function (resolve, reject) {
    let stringQuery = `INSERT INTO FABRIC (DESCRIPTION,WEIGHT, ID_MERCHANT) 
                        VALUES ('${description}',${weight},${idMerchant})`;
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows.insertId);
    });
  });
}

function insertShoeMaterialProd(idShoeMaterial, idProd) {
    return new Promise(function (resolve, reject) {
      let stringQuery = `insert into SHOE_MATERIAL_PROD (ID_SHOE_MATERIAL, ID_PRODUCT) 
                          values ('${idShoeMaterial}',${idProd})`;
      con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
        resolve(rows.insertId);
      });
    });
  }

function getStringIds(fabric) {
  let str = "";
  fabric.composition.forEach((element) => {
    str += element.idFiber + ",";
  });
  return str.substring(0, str.length - 1);
}

function getFiberIdsCount(fabric) {
  let count = 0;
  fabric.composition.forEach((element) => {
    count++;
  });
  return count;
}

// async function saveFabricComposition() {
//   findFibers(fiberIds).then((result) => {
//     if (result.length !== getFiberIdsCount(fabric)) {
//       reject("Una de las fibras ingresadas no existe en el sistema");
//     } else {
//       saveNewFabricInternal(
//         idMerchant,
//         fabric.description,
//         fabric.weight,
//         fabric,
//         numFab
//       ).then((result) => {
//         resolve(result);
//       });
//     }
//   });
// }
async function saveFabric(fabric, idMerchant, numFab) {
  return new Promise(function (resolve, reject) {
    let fiberIds = getStringIds(fabric);
    if (fabric.saveDuplicateFabric === 1) {
      saveNewFabricInternal(
        idMerchant,
        fabric.description,
        fabric.weight,
        fabric,
        numFab
      ).then((result) => {
        resolve(result);
      });
    } else {
      findFabric(fiberIds, idMerchant).then((result) => {
        if (result.length > 0) {
          reject(
            "Ya existe una tela con esa composición en el sistema: " + result
          );
        } else {
          findFibers(fiberIds).then((result) => {
            if (result.length !== getFiberIdsCount(fabric)) {
              reject("Una de las fibras ingresadas no existe en el sistema");
            } else {
              saveNewFabricInternal(
                idMerchant,
                fabric.description,
                fabric.weight,
                fabric,
                numFab
              ).then((result) => {
                resolve(result);
              });
            }
          });
        }
      });
    }
  });
}

async function saveNewFabricInternal(idMerchant, fabric) {
  return new Promise(function (resolve, reject) {
    saveNewFabric(idMerchant, fabric.description, fabric.weight).then(
      (result) => {
        let idFabric = result;

        if (idFabric > 0) {
          if (fabric.composition.length > 0) {
            fabric.composition.forEach(async (element) => {
              await saveFiberPercentager(
                element.idFiber,
                element.percentage,
                idFabric
              ).then((result) => {
                resolve(idFabric);
              });
            });
          } else {
            resolve(idFabric);
          }
        }
      }
    );
  });
}

async function saveFiberPercentage(fabric, idFabric) {
  return new Promise(function (resolve, reject) {
    if (idFabric > 0) {
      if (fabric.composition.length > 0) {
        fabric.composition.forEach(async (element) => {
          await saveFiberPercentager(
            element.idFiber,
            element.percentage,
            idFabric
          ).then((result) => {
            resolve(idFabric);
          });
        });
      } else {
        resolve(idFabric);
      }
    }
  });
}
function findDesigner(idDesigner, idMerchant) {
  let stringQuery = `select * from DESIGNER where id = ${idDesigner} and id_merchant = ${idMerchant}`;
  return new Promise(function (resolve, reject) {
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
function saveSizeCurveShoes(sizeCurve) {
    console.log("alo size curve")
  let id;
  return new Promise(function (resolve, reject) {
    let stringQuery = `INSERT INTO SIZE_CURVE_SHOES ( THIRTYFOUR,
                                                      THIRTYFIVE,
                                                      THIRTYSIX,
                                                      THIRTYSEVEN,
                                                      THIRTYEIGHT,
                                                      THIRTYNINE,
                                                      FORTY)  values(${sizeCurve[0]},${sizeCurve[1]},
                                                                    ${sizeCurve[2]},${sizeCurve[3]},${sizeCurve[4]},${sizeCurve[5]},${sizeCurve[6]})`;
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err)
        return reject(err);
      }

      resolve(rows.insertId);
    });
 });
}
function saveSizeCurveDenim(sizeCurve) {
  console.log("alo size curve")
let id;
return new Promise(function (resolve, reject) {
  let stringQuery = `INSERT INTO SIZE_CURVE_DENIM (TWENTYTHREE,
                                                  TWENTYFOUR,
                                                  TWENTYFIVE,
                                                  TWENTYSIX,
                                                  TWENTYSEVEN,
                                                  TWENTYEIGHT,
                                                  TWENTYNINE,
                                                  THIRTY,
                                                  THIRTYONE,
                                                  THIRTYTWO,
                                                  THIRTYTHREE,
                                                  THIRTYFOUR,
                                                  THIRTYFIVE,
                                                  THIRTYSIX,
                                                  THIRTYSEVEN,
                                                  THIRTYEIGHT)  VALUES(${sizeCurve[0]},${sizeCurve[1]},
                                                                      ${sizeCurve[2]},${sizeCurve[3]},${sizeCurve[4]},${sizeCurve[5]},${sizeCurve[6]},
                                                                      ${sizeCurve[7]},${sizeCurve[8]},${sizeCurve[9]},${sizeCurve[10]}${sizeCurve[11]},
                                                                      ${sizeCurve[12]},${sizeCurve[13]},${sizeCurve[14]},${sizeCurve[15]})`;
                                                                      console.log(stringQuery);
  con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
    if (err) {
      console.log(err);
      return reject(err);
    }
    resolve(rows.insertId);
  });
});
}
function saveSizeCurveClothes(sizeCurve) {
  console.log("alo size curve")
let id;
return new Promise(function (resolve, reject) {
  let stringQuery = `INSERT INTO SIZE_CURVE_CLOTHES (U,
                                                    2XS,
                                                    XS,
                                                    S,
                                                    M,
                                                    L,
                                                    XL,
                                                    2XL,
                                                    3XL,
                                                    4XL,
                                                    5XL,
                                                    6XL)  values(${sizeCurve[0]},${sizeCurve[1]},
                                                                        ${sizeCurve[2]},${sizeCurve[3]},${sizeCurve[4]},${sizeCurve[5]},${sizeCurve[6]},
                                                                        ${sizeCurve[7]},${sizeCurve[8]},${sizeCurve[9]},${sizeCurve[10]},${sizeCurve[11]})`;
                                                                        console.log(stringQuery.toUpperCase());
  con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
    if (err) {
      console.log(err);
      return reject(err);
    }
    resolve(rows.insertId);
  });
});
}
async function saveFiberPercentager(idFiber, percentage, idFabric) {
  return new Promise(function (resolve, reject) {
    let stringQuery = `insert into PERCENTAGE_FIBER values (${idFiber},${percentage},${idFabric})`;
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function savePicture(picture, idProuct, isMain, pictNum) {
  return new Promise(function (resolve, reject) {
    let stringQuery = `INSERT INTO product_picture (PATH, ID_PRODUCT, IS_MAIN) VALUES ('${picture}', ${idProuct}, ${isMain})`;
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
//TODO MG: Que eran esos 1
function saveProduct(prod, prodNumber) {
  return new Promise(function (resolve, reject) {
    //let shipping = ; //TODO MG: ?? que es el 3?
    let idRise = prod.idRise === undefined ? null : prod.idRise;
    let stringQuery = `INSERT INTO PRODUCT (NAME, QUANTITY, WEIGHT, DETAIL, ID_INSPECTION, ID_MERCHANT, ID_TIPOLOGY, 
                       ID_SEASON, ID_COUNTRY, 
                       ID_DESIGNER, ID_STATUS, COST, COST_IN_STORE, ID_SUPPLIER, ID_INDUSTRY, ID_MERCHANT_BRAND, 
                       YEAR, PROYECTA, ID_CONCEPT, ID_LINE, ID_BODY_FIT, ID_RISE, NUMBER, EXTENDED_SIZE,
                       SIZE_CURVE_TYPE, ID_DEPARTMENT) VALUES ('${prod.name}', ${prod.quantity},${prod.weight},'${prod.detail === undefined ? "" : prod.detail}',
                       1, ${prod.idMerchant},${prod.idTipology},${prod.idSeason},${prod.idCountry},
                       ${prod.idDesigner}, 1,${prod.cost === undefined ? 0 : prod.cost},
                       ${prod.costInStore === undefined ? 0 : prod.costInStore},${prod.idSupplier},
                       ${prod.idIndustry},${prod.idMerchantBrand}, ${prod.year}, ${prod.proyecta === true ? 1 : 0}, ${prod.idConcept}, ${prod.idLine},
                       ${prod.idBodyFit}, ${idRise}, ${prodNumber}, ${prod.extendedSize},${prod.sizeCurveType}, ${prod.idDepartment})`;//order
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows.insertId);
    });
  });
}
//TODO MG: Que eran esos 1
function updateProduct(prod, prodNumber) {
    return new Promise(function (resolve, reject) {
      let stringQuery = 'UPDATE PRODUCT SET ';
        if (prod.name !== undefined) {
            stringQuery += `NAME = '${prod.name}', `;
        }
        if (prod.quantity !== undefined) {
            stringQuery += `QUANTITY = ${prod.quantity}, `;
        }
        if (prod.weight !== undefined) {
            stringQuery += `WEIGHT = ${prod.weight}, `;
        }
        if (prod.detail !== undefined) {
            stringQuery += `DETAIL = ${prod.detail}, `;
        }
        if (prod.idInspection !== undefined) {
            stringQuery += `ID_INSPECTION = ${prod.idInspection}, `;
        }
        if (prod.idCollection !== undefined) {
            stringQuery += `ID_COLLECTION = ${prod.idCollection}, `;
        }
        if (prod.idTypology !== undefined) {
            stringQuery += `ID_TIPOLOGY = ${prod.idTypology}, `;
        }
        if (prod.idSeason !== undefined) {
            stringQuery += `ID_SEASON = ${prod.idSeason}, `;
        }
        if (prod.entryDate !== undefined) {
            stringQuery += `ENTRY_DATE = ${prod.entryDate}, `;
        }
        if (prod.idCountry !== undefined) {
            stringQuery += `ID_COUNTRY = ${prod.idCountry}, `;
        }
        if (prod.idShipping !== undefined) {
            stringQuery += `ID_SHIPPING = ${prod.idShipping}, `;
        }
        if (prod.idDesigner !== undefined) {
            stringQuery += `ID_DESIGNER = ${prod.idDesigner}, `;
        }
        if (prod.idStatus !== undefined) {
            stringQuery += `ID_STATUS = ${prod.idStatus}, `;
        }
        if (prod.cost !== undefined) {
            stringQuery += `COST = ${prod.cost}, `;
        }
        if (prod.costInStore !== undefined) {
            stringQuery += `COST_IN_STORE = ${prod.costInStore}, `;
        }
        if (prod.idCountryDestination !== undefined) {
            stringQuery += `ID_COUNTRY_DESTINATION = ${prod.idCountryDestination}, `;
        }
        if (prod.idSupplier !== undefined) {
            stringQuery += `ID_SUPPLIER = ${prod.idSupplier}, `;
        }
        if (prod.idIndustry !== undefined) {
            stringQuery += `ID_INDUSTRY = ${prod.idIndustry}, `;
        }
        if (prod.idMerchantBrand !== undefined) {
            stringQuery += `ID_MERCHANT_BRAND = ${prod.idMerchantBrand}, `;
        }
        if (prod.year !== undefined) {
            stringQuery += `YEAR = ${prod.year}, `;
        }
        if (prod.proyecta !== undefined) {
            stringQuery += `PROYECTA = ${prod.proyecta}, `;
        }
        if (prod.idConcept !== undefined) {
            stringQuery += `ID_CONCEPT = ${prod.idConcept}, `;
        }
        if (prod.idLine !== undefined) {
            stringQuery += `ID_LINE = ${prod.idLine}, `;
        }
        if (prod.idBodyFit !== undefined) {
            stringQuery += `ID_BODY_FIT = ${prod.idBodyFit}, `;
        }
        if (prod.idRise !== undefined) {
            stringQuery += `ID_RISE = ${prod.idRise}, `;
        }
        if (prod.number !== undefined) {
            stringQuery += `NUMBER = ${prod.number}, `;
        }
        if (prod.extendedSize !== undefined) {
            stringQuery += `EXTENDED_SIZE = ${prod.extendedSize}, `;
        }
        if (prod.warehouseEntryDate !== undefined) {
            stringQuery += `WAREHOUSE_ENTRY_DATE = ${prod.warehouseEntryDate}, `;
        }
        if (prod.idSizeCurve !== undefined) {
            stringQuery += `ID_SIZE_CURVE = ${prod.idSizeCurve}, `;
        }
        if (prod.sizeCurveType !== undefined) {
            stringQuery += `SIZE_CURVE_TYPE = ${prod.sizeCurveType}, `;
        }



        stringQuery = stringQuery.slice(0, -2); // Remove the trailing comma and space

        stringQuery += ` WHERE ID = ${prod.id}`;
        console.log(stringQuery.toUpperCase());
        con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
            if (err) {
              return reject(err);
            }
            resolve(rows.affectedRows === 1);
          });
        });
    
  }
function getProductNumber(idSeason){

    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT
        CASE WHEN COUNT(*) > 1
        THEN (SELECT MAX(NUMBER) + 1 FROM PRODUCT WHERE ID_SEASON = ${idSeason})
        ELSE
        1
        END AS number
        FROM PRODUCT
        WHERE ID_SEASON = ${idSeason}`;//order
        console.log(stringQuery.toUpperCase())
        con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          console.log("prod number ");
          console.log(rows);
          resolve(rows[0].NUMBER);
        });
      });
}

function getMerchantBrands(idMerchant){
    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT ID Id, NAME Name, CODE Code, ID_MERCHANT IdMerchant FROM MERCHANT_BRAND WHERE ID_MERCHANT = ${idMerchant}`;//order
        con.query(stringQuery, function (err, rows, fields) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          console.log(rows)
          resolve(rows);
        });
      });
}

function getMerchantConcepts(idMerchant){
    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT ID Id, DESCRIPTION Description FROM CONCEPT WHERE ID_MERCHANT = ${idMerchant}`;//order
        con.query(stringQuery, function (err, rows, fields) {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
}

function getMerchantShoeMaterials(idMerchant){
    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT ID Id, DESCRIPTION Description FROM SHOE_MATERIAL WHERE ID_MERCHANT = ${idMerchant}`;//order
        con.query(stringQuery, function (err, rows, fields) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(rows);
        });
      });
}

function getProduct(idProduct) {
  console.log("Getting product data");
  return new Promise(function (resolve, reject) {
    let stringQuery = `SELECT ID Id,
                              NAME Name,
                              QUANTITY Quantity,
                              WEIGHT Weight,
                              DETAIL Detail,
                              ID_INSPECTION IdInspection,
                              ID_MERCHANT IdMerchant,
                              ID_SEASON IdSeason,
                              ID_COUNTRY IdCountry,
                              ID_TIPOLOGY IdTipology,
                              ID_DESIGNER IdDesigner,
                              ID_STATUS IdStatus,
                              COST Cost,
                              COST_IN_STORE CostInStore,
                              ID_SUPPLIER IdSupplier,
                              ID_LINE IdLine,
                              EXTENDED_SIZE ExtendedSize,
                              ID_INDUSTRY IdIndustry,
                              ID_BODY_FIT IdBodyFit,
                              ID_RISE IdRise,
                              NUMBER ProductNumber,
                              ID_MERCHANT_BRAND IdMerchantBrand,
                              YEAR Year,
                              PROYECTA Proyecta,
                              ID_CONCEPT IdConcept,
                              ID_SIZE_CURVE IdSizeCurve,
                              SIZE_CURVE_TYPE SizeCurveType,
                              ID_DEPARTMENT IdDepartment
                              FROM PRODUCT
                              WHERE ID = ${idProduct}`;
    con.query(stringQuery, function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(rows);
      resolve(rows);
    });
  });
}

function getFormmatedDate() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`.toString();
  }

  function saveColorFabricCombo(idComboFabric, idColor, idSizeCurve) {

    
    return new Promise(function (resolve, reject) {
      let stringQuery = `INSERT INTO COMBO_FABRIC_COLOR (ID_COMBO_FABRIC, ID_COLOR, ID_STATUS, ID_SIZE_CURVE) VALUES (${idComboFabric},${idColor},1,${idSizeCurve})`;
  
      con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
  
        resolve(rows);
      });
    });
  }
  function savePrintFabricCombo
  (idComboFabric, idPrint, idSizeCurve) {

    
    return new Promise(function (resolve, reject) {
      let stringQuery = `INSERT INTO COMBO_FABRIC_PRINT (ID_COMBO_FABRIC, ID_PRINT, ID_STATUS, ID_SIZE_CURVE) VALUES (${idComboFabric},${idPrint},1,${idSizeCurve})`;
  
      con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
  
        resolve(rows);
      });
    });
  }

function saveComboAvio(idAvio, 
                       idCountryDestination, 
                       idProduct,
                       entryDate,
                       warehouseEntryDate,
                       shippingDate,
                       idShipping,
                       colors) {
  let formattedEntryDate = getFormattedDate(entryDate);
  let formattedWarehouseEntryDate = getFormattedDate(warehouseEntryDate);
  let formattedShippingDate = getFormattedDate(shippingDate);
    
  return new Promise(function (resolve, reject) {
    let stringQuery = `INSERT INTO COMBO_AVIO (ID_AVIO, ID_PRODUCT,
                       ID_COUNTRY_DESTINATION,	ENTRY_DATE,	WAREHOUSE_ENTRY_DATE,
                       	SHIPPING_DATE,	ID_SHIPPING) VALUES (${idAvio},${idProduct},
                        ${idCountryDestination}, STR_TO_DATE(${formattedEntryDate}, '%d,%m,%Y'), 
                        STR_TO_DATE(${formattedWarehouseEntryDate}, '%d,%m,%Y'),
                        STR_TO_DATE(${formattedShippingDate}, '%d,%m,%Y'), ${idShipping})`;
    console.log(stringQuery);                      
    con.query(stringQuery, async function (err, rows, fields) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log("fale");
      console.log(rows);
      await colors.map(c => {
        saveComboAvioColor(rows.insertId,c);
      });
      resolve(rows);
    });
  });
}

async function saveComboAvioColor(idComboAvio, idColor) {
return new Promise(function (resolve, reject) {
let stringQuery = `INSERT INTO COMBO_AVIO_COLOR (ID_COMBO_AVIO, ID_COLOR,
                   ID_STATUS) VALUES (${idComboAvio},${idColor}, 1)`;
console.log(stringQuery);
con.query(stringQuery, function (err, rows, fields) {
if (err) {
return reject(err);
}

resolve(rows);
});
});
}

function getMerchantRise(idMerchant) {
    return new Promise(function (resolve, reject) {
      let stringQuery = `SELECT ID Id, DESCRIPTION Description FROM RISE WHERE ID_MERCHANT = ${idMerchant}`;
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

function getIdPrint(idPrint) {
  return new Promise(function (resolve, reject) {
    let stringQuery = `select * from printimpacta where id = ${idPrint}`;
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }

      resolve(rows);
    });
  });
}

function savePrint(description, colorCount) {
  return new Promise(function (resolve, reject) {
    let stringQuery = `insert into PRINT (NAME, COLOUR_COUNT) values ( '${description}',${colorCount})`;

    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }

      resolve(rows);
    });
  });
}

function saveComboFabric(
  idFabric,
  idColor,
  idPrint,
  printDescription,
  colorCount,
  placement,
  idProduct,
  consumption,
  idCountryDestination,
  entryDate,
  warehouseEntryDate,
  shippingDate,
  idShipping,
  colors,
  prints,
  idSizeCurve
) {
  return new Promise(function (resolve, reject) {
    savePrint(printDescription, colorCount).then((result) => {
      insertComboFabric(
        idFabric,
        idColor,
        idPrint,
        placement,
        idProduct, 
        consumption,
        idCountryDestination,
        entryDate,
        warehouseEntryDate,
        shippingDate,
        idShipping,
        colors,
        prints,
        idSizeCurve
      ).then((result) => {
        console.log(result)
        resolve(result);
      });
    });
  });
}


function getDateFormatted(){
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function insertComboFabric(
  idFabric,
  idColor,
  idPrint,
  placement,
  idProduct,
  consumption,
  idCountryDestination,
  entryDate,
  warehouseEntryDate,
  shippingDate,
  idShipping, 
  colors,
  prints,
  idSizeCurve
) {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');
    let shortDate = `${year}-${month}-${day}`.toString();
    console.log("idCountryDestination " + idCountryDestination);
    return new Promise(function (resolve, reject) {
      let onCreateStatus = 1;
      let formattedEntryDate = getFormattedDate(entryDate);
      let formattedWarehouseEntryDate = getFormattedDate(warehouseEntryDate);
      let formattedShippingDate = getFormattedDate(shippingDate);
      
      let stringQuery = `INSERT INTO COMBO_FABRIC (ID_PRODUCT, ID_FABRIC, ID_PLACEMENT,
                               CONSUMPTION,
                               ID_COUNTRY_DESTINATION, ENTRY_DATE, WAREHOUSE_ENTRY_DATE, 
                               SHIPPING_DATE, ID_SHIPPING)
                               VALUES (${idProduct}, ${idFabric}, ${placement}, ${consumption}, 
                                ${idCountryDestination},
                                STR_TO_DATE(${formattedEntryDate}, '%d,%m,%Y'), 
                                STR_TO_DATE(${formattedWarehouseEntryDate}, '%d,%m,%Y'),
                                STR_TO_DATE(${formattedShippingDate}, '%d,%m,%Y'), ${idShipping})`;
                          
      con.query(stringQuery, async function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      console.log(rows);
      await prints.map(c => {
        savePrintFabricCombo(rows.insertId,c,idSizeCurve);
      });
      await colors.map(c => {
        saveColorFabricCombo(rows.insertId,c,idSizeCurve);
      });
      resolve(rows);
    });
  });
}

function getFormattedDate(strDate) {
  let date = new Date(strDate);
  return (
    "'" +
    date.getUTCDate() +
    "," +
    (date.getUTCMonth() + 1) + // Adding 1 to get the correct month (0-11)
    "," +
    date.getUTCFullYear() +
    "'"
  );

}

function getAvio(idAvio) {
  return new Promise(function (resolve, reject) {
    let stringQuery = `SELECT * FROM AVIO WHERE ID IN (${idAvio})`;
    con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getTipology(idTipology){
    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT ID, NAME FROM TIPOLOGY WHERE ID = ${idTipology}`;
        console.log(stringQuery.toUpperCase());
        con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
          if (err) {
            return reject(err);
          }
          console.log(rows);
          resolve(rows);
        });
      });
}

function getMerchantClothingSizeCurve(){
    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT ID, SIZE FROM SIZE_CURVE_CLOTHES`;
        console.log(stringQuery.toUpperCase())
        con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(rows);
        });
      });
}
function getMerchantDenimSizeCurve(){
    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT ID, SIZE FROM SIZE_CURVE_DENIM`;
        console.log(stringQuery.toUpperCase())
        con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(rows);
        });
      });
}
function getMerchantShoesSizeCurve(){
    return new Promise(function (resolve, reject) {
        let stringQuery = `SELECT ID, SIZE FROM SIZE_CURVE_SHOES`;
        console.log(stringQuery.toUpperCase())
        con.query(stringQuery.toUpperCase(), function (err, rows, fields) {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(rows);
        });
      });
}

function getComboFabric(idProduct) {

return new Promise(function (resolve, reject) {
let stringQuery = `
SELECT ID Id,ID_PRODUCT IdProduct, ID_FABRIC IdFabric ,ID_PLACEMENT IdPlacement,
CONSUMPTION Consumption ,SHIPPING_DATE ShippingDate,WAREHOUSE_ENTRY_DATE WarehouseEntryDate,
ID_SHIPPING IdShipping, ID_COUNTRY_DESTINATION IdCountryDestination, ENTRY_DATE EntryDate
FROM COMBO_FABRIC WHERE ID_PRODUCT = ${idProduct}`;                      
con.query(stringQuery, async function (err, rows, fields) {
if (err) {
console.log(err);
return reject(err);
}
console.log("bb");
console.log(rows);
resolve(rows);
});
});
}

function getComboAvio(idProduct) {

  return new Promise(function (resolve, reject) {
  let stringQuery = `
  SELECT ID Id,ID_PRODUCT IdProduct, ID_AVIO IdAvio ,SHIPPING_DATE ShippingDate,
  WAREHOUSE_ENTRY_DATE WarehouseEntryDate,
  ID_SHIPPING IdShipping, ID_COUNTRY_DESTINATION IdCountryDestination, ENTRY_DATE EntryDate
  FROM COMBO_AVIO WHERE ID_PRODUCT = ${idProduct}`;                      
  con.query(stringQuery, async function (err, rows, fields) {
  if (err) {
  console.log(err);
  return reject(err);
  }
  console.log("bb");
  console.log(rows);
  resolve(rows);
  });
  });
  }
  
  function getComboAviosColors(IdComboAvio) {

    return new Promise(function (resolve, reject) {
    let stringQuery = `
    SELECT ID	Id, ID_COMBO_AVIO	IdComboAvio, ID_COLOR IdColor,
    ID_STATUS	IdStatus, STATUS_DATE IdStatusDate 
    FROM COMBO_AVIO_COLOR WHERE ID_COMBO_AVIO = ${IdComboAvio}`;                      
    con.query(stringQuery, async function (err, rows, fields) {
    if (err) {
    console.log(err);
    return reject(err);
    }
    console.log("bb");
    console.log(rows);
    resolve(rows);
    });
    });
    }
function getComboFabricColors(IdComboFabric) {

  return new Promise(function (resolve, reject) {
  let stringQuery = `
  SELECT ID Id,	ID_COMBO_FABRIC	IdComboFabric, ID_COLOR IdColor,
  ID_STATUS IdStatus FROM COMBO_FABRIC_COLOR WHERE ID_COMBO_FABRIC = ${IdComboFabric}`;                      
  con.query(stringQuery, async function (err, rows, fields) {
  if (err) {
  console.log(err);
  return reject(err);
  }
  console.log("bb");
  console.log(rows);
  resolve(rows);
  });
  });
  }
  function getComboFabricPrints(IdComboFabric) {

    return new Promise(function (resolve, reject) {
    let stringQuery = `
    SELECT ID Id,	ID_COMBO_FABRIC	IdComboFabric, ID_PRINT IdPrint,
    ID_STATUS IdStatus FROM COMBO_FABRIC_PRINT WHERE ID_COMBO_FABRIC = ${IdComboFabric}`;                      
    con.query(stringQuery, async function (err, rows, fields) {
    if (err) {
    console.log(err);
    return reject(err);
    }
    console.log("bb");
    console.log(rows);
    resolve(rows);
    });
    });
    }
  

module.exports.getMerchant = getMerchant;
module.exports.getMerchantSeason = getMerchantSeason;
module.exports.getMerchantDepartment = getMerchantDepartment;
module.exports.getMerchantManagmentUnits = getMerchantManagmentUnits;
module.exports.getMerchantSeasons = getMerchantSeasons;
module.exports.getMerchantSuppliers = getMerchantSuppliers;
module.exports.getMerchantDesigners = getMerchantDesigners;
module.exports.getCountries = getCountries;
module.exports.getTipologies = getTipologies;
module.exports.getFibers = getFibers;
module.exports.getColors = getColors;
module.exports.getShippingTypes = getShippingTypes;
module.exports.findCollection = findCollection;
module.exports.findShippingType = findShippingType;
module.exports.findCountry = findCountry;
module.exports.findTIPOLOGY = findTIPOLOGY;
module.exports.findStatus = findStatus;
module.exports.saveProduct = saveProduct;
module.exports.findDesigner = findDesigner;
module.exports.saveFabric = saveFabric;
module.exports.saveComboFabric = saveComboFabric;
module.exports.saveComboAvio = saveComboAvio;
module.exports.getAvio = getAvio;
module.exports.savePicture = savePicture;
module.exports.getProduct = getProduct;
module.exports.getFabrics = getFabrics;
module.exports.getFibers = getFibers;
module.exports.getPlacements = getPlacements;
module.exports.getTrims = getTrims;
module.exports.startTransaction = startTransaction;
module.exports.getFabricFromId = getFabricFromId;
module.exports.saveFiberPercentage = saveFiberPercentage;
module.exports.saveNewFabricInternal = saveNewFabricInternal;
module.exports.getFabricComposition = getFabricComposition;
module.exports.getMerchantBrands = getMerchantBrands;
module.exports.getMerchantConcepts = getMerchantConcepts;
module.exports.getMerchantIndustries = getMerchantIndustries;
module.exports.getMerchantLines = getMerchantLines;
module.exports.getMerchantBodyFit = getMerchantBodyFit;
module.exports.getMerchantRise = getMerchantRise;
module.exports.getTipology = getTipology;
module.exports.getProductNumber = getProductNumber;
module.exports.getMerchantShoeMaterials = getMerchantShoeMaterials;
module.exports.insertShoeMaterialProd = insertShoeMaterialProd;
module.exports.getMerchantClothingSizeCurve = getMerchantClothingSizeCurve;
module.exports.getMerchantDenimSizeCurve = getMerchantDenimSizeCurve;
module.exports.getMerchantShoesSizeCurve = getMerchantShoesSizeCurve;
module.exports.updateProduct = updateProduct;
module.exports.saveColorFabricCombo = saveColorFabricCombo;
module.exports.savePrintFabricCombo = savePrintFabricCombo;
module.exports.getComboFabric = getComboFabric;
module.exports.getComboFabricColors = getComboFabricColors;
module.exports.getComboFabricPrints = getComboFabricPrints;
module.exports.getComboAvio = getComboAvio;
module.exports.getComboAviosColors = getComboAviosColors;
module.exports.saveSizeCurveShoes = saveSizeCurveShoes;
module.exports.saveSizeCurveDenim = saveSizeCurveDenim;
module.exports.saveSizeCurveClothes = saveSizeCurveClothes;