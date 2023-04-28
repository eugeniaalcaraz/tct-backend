const { Console } = require('console');
const { on } = require('events');
const con = require('../configuration/ConfigurationDB');
const util = require( 'util' );
const { get } = require('http');
const { start } = require('repl');

function getMerchant({idMerchant}){
    let stringQuery = `SELECT * FROM merchant where id = ${idMerchant}`;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function startTransaction(){
    let stringQuery = "START TRANSACTION";
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
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
//         con.query(stringQuery, function (err, rows, fields) {
//              if (err) {
//                  return reject(err);
//              }
//             resolve(rows);
//         });
//     });   
// }




function getMerchantSeason({idMerchant, idSeason}){
    let stringQuery = "SELECT * FROM merchant m INNER JOIN season s on m.ID = s.ID_MERCHANT where s.ID = " + idSeason + " and s.ID_MERCHANT = " + idMerchant;
       return new Promise(function(resolve, reject) {
           con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getMerchantDepartment({idMerchant, idDepartment}){
    let stringQuery = "select * from season s inner join season_department sd on s.id = sd.ID_SEASON where s.ID_MERCHANT = " + idMerchant + " and sd.id_department = " + idDepartment;
       return new Promise(function(resolve, reject) {
           con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getMerchantDepartments({idMerchant}){
    let stringQuery = "select dep.ID Id, dep.DESCRIPTION Description from department dep inner join department_merchant merchantDept on dep.ID = merchantDept.ID_DEPARTMENT where merchantDept.ID_MERCHANT = " + idMerchant;
       return new Promise(function(resolve, reject) {

           con.query(stringQuery, function (err, rows, fields) {
                if (err) {

                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getMerchantSeasons({idMerchant}){
    let stringQuery = "SELECT ID Id, NAME Name FROM season WHERE ID_MERCHANT = " + idMerchant;
       return new Promise(function(resolve, reject) {
           con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getMerchantSuppliers({idMerchant}){
    let stringQuery = "select sup.ID Id, sup.NAME Name, sup.LASTNAME Lastname from supplier sup inner join supplier_merchant supMerchant on sup.ID = supMerchant.ID_SUPPLIER WHERE supMerchant.ID_MERCHANT = " + idMerchant;
       return new Promise(function(resolve, reject) {
           con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getMerchantDesigners({idMerchant}){
    let stringQuery = "SELECT ID Id, NAME Name, LAST_NAME LastName FROM DESIGNER WHERE ACTIVE = 1 AND ID_MERCHANT =" + idMerchant;
       return new Promise(function(resolve, reject) {
           con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getCountries(){
    let stringQuery = "SELECT ID Id, NAME Name FROM COUNTRY";
       return new Promise(function(resolve, reject) {
           con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getTipologies(){
    let stringQuery = "SELECT ID Id, DESCRIPTION Description FROM TIPOLOGY";
       return new Promise(function(resolve, reject) {
           con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
               resolve(rows);
           });
       });
}

function getFibers(){
    let stringQuery = "SELECT ID Id, DESCRIPTION Description FROM FIBER";
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
             if (err) {
                 return reject(err);
             }
            resolve(rows);
        });
    });
}

function getColors(){
    let stringQuery = "SELECT ID Id, DESCRIPTION Description FROM COLOR";
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getTrims(){
    let stringQuery = "select ID Id, DESCRIPTION Description from avio";
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getPlacements(){
    let stringQuery = "SELECT ID Id, DESCRIPTION Description FROM PLACEMENT";
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getShippingTypes(){
    let stringQuery = "SELECT ID Id, DESCRIPTION Description FROM SHIPPING_TYPE";
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findCollection(idCollection, idMerchant){
    let stringQuery = "select * from season s inner join merchant m on s.id_merchant = m.id inner join collection c on c.ID_SEASON = s.id where c.ID = " + idCollection + " and m.ID = " + idMerchant;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findShippingType(idShippingType){

    let stringQuery = "select * from shipping_type where id = " + idShippingType;

    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findCountry(idCountry){
    let stringQuery = "select * from country where id = " + idCountry;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findTipology(idTipology){
    let stringQuery = "select * from tipology where id = " + idTipology;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
function findStatus(idStatus){
    let stringQuery = "select * from status where id = " + idStatus;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findShippingType(idShippingType){
    let stringQuery = "select * from shipping_type where id = " + idShippingType;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
function findFabric(fabricIds, idMerchant){
    let stringQuery = "SELECT id_fabric FROM percentage_fiber pf inner join fabric f on  pf.id_fabric = f.id where id_fiber in ( " + fabricIds+ ") and f.id_merchant = " + idMerchant +" group by id_fabric having count(id_fabric) > 1 ";
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function getFabricFromId(idFabric, idMerchant){
    let stringQuery = "select * from fabric where id = " + idFabric + " and ID_MERCHANT = " + idMerchant;

    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

async function getFabrics(idMerchant){
    let stringQuery = "SELECT ID Id, DESCRIPTION Description, WEIGHT Weight, ID_MERCHANT IdMerchant FROM fabric WHERE ID_MERCHANT = " + idMerchant + " AND DESCRIPTION <> 'PendingDescription'";

    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

async function getFabricComposition(idFabric){

    let stringQuery = "select f.DESCRIPTION Description, pf.PERCENTAGE Percentage  from percentage_fiber pf inner join fiber f on pf.ID_FIBER = f.ID where pf.ID_FABRIC = " +  idFabric;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {

                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findFibers(fiberIds){
    let stringQuery = `select * from fiber where id in (${fiberIds})`;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
function getFabric(description, weight){
    let stringQuery = `SELECT * FROM fabric where description = ${description} and weight = ${weight}`;

    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {

            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function saveNewFabric(idMerchant, description, weight){
    let idFab; 
    return new Promise(function(resolve, reject){

    getFabric(description, weight).then(res => {

        if(res.length > 0){ //Si ya existe, devuelve el id existente

                idFab = res[0].ID;
                resolve(idFab);
        }else{
                insertFabric(idFab, description, weight, idMerchant).then(res =>{
                    resolve(idFab);
                })
            
    }

    });    })
}

function insertFabric(description, weight, idMerchant){
    return new Promise(function(resolve, reject){

        let stringQuery = `insert into fabric (ID, DESCRIPTION,WEIGHT, ID_MERCHANT) 
                           values (${idFab}, ${description},${weight},${idMerchant})`; 

        con.query(stringQuery, function (err, rows, fields) {
                    if (err) {

                        return reject(err);
                    }

                    resolve(idFab);
                });
    })
}

function getStringIds(fabric){
    let str = "";
    fabric.composition.forEach(element => {
        str += element.idFiber + ",";
    });
    return str.substring(0, str.length - 1);
}

function getFiberIdsCount(fabric){
    let count = 0;
    fabric.composition.forEach(element => {
        count++;
    });
    return count;
}

async function saveFabricComposition(){

            findFibers(fiberIds).then(result => {
                if(result.length !== getFiberIdsCount(fabric)){
                    reject("Una de las fibras ingresadas no existe en el sistema");
                }else{
                    saveNewFabricInternal(idMerchant, fabric.description, fabric.weight, fabric, numFab).then(result => {
                        resolve(result);
                    });
                }
            })
         
}
async function saveFabric(fabric, idMerchant, numFab){

    return new Promise(function(resolve, reject) {
    let fiberIds = getStringIds(fabric);
    if(fabric.saveDuplicateFabric === 1){
        saveNewFabricInternal(idMerchant, fabric.description, fabric.weight, fabric, numFab).then(result => {
            resolve(result);
        });
    }else{
        findFabric(fiberIds, idMerchant).then(result => {       
            if(result.length > 0){
                reject("Ya existe una tela con esa composición en el sistema: " + result);
            }else{
                findFibers(fiberIds).then(result => {
                    if(result.length !== getFiberIdsCount(fabric)){
                        reject("Una de las fibras ingresadas no existe en el sistema");
                    }else{
                        saveNewFabricInternal(idMerchant, fabric.description, fabric.weight, fabric, numFab).then(result => {
                            resolve(result);
                        });
                    }
                })
            }                                                           
            });
    }
 });
}

async function saveNewFabricInternal(idMerchant, fabric){
    return new Promise(function(resolve, reject) {

    saveNewFabric(idMerchant, fabric.description, fabric.weight).then(result => {
        let idFabric = result;
        if(idFabric > 0){
            if(fabric.composition.length > 0){
                fabric.composition.forEach(async element => {
                    await saveFiberPercentager(element.idFiber, element.percentage, idFabric).then(result => {
                    resolve(idFabric);
                    });
                });
            }else{
                resolve(idFabric);
            }

        }
    })
})
}

async function saveFiberPercentage(fabric,idFabric){
    return new Promise(function(resolve, reject) {
        if(idFabric > 0){
            if(fabric.composition.length > 0){
                fabric.composition.forEach(async element => {
                    await saveFiberPercentager(element.idFiber, element.percentage, idFabric).then(result => {
                        resolve(idFabric);
                    });
                });
            }else{
                resolve(idFabric);
            }
        }
    });
}
function findDesigner(idDesigner, idMerchant){
    let stringQuery = `select * from designer where id = ${idDesigner} and id_merchant = ${idMerchant}`;
    return new Promise(function(resolve, reject) {
        con.query(stringQuery, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
function saveSizeCurve(sizeCurve ,idMerchant){
    let id;
    return new Promise(function(resolve, reject) {
        let stringQuery = `insert into size_curve values('-',${idMerchant},${sizeCurve[0]},${sizeCurve[1]},
                           ${sizeCurve[2]},${sizeCurve[3]},${sizeCurve[4]},${sizeCurve[5]},${sizeCurve[6]},
                           ${sizeCurve[7]},${sizeCurve[8]})`;
            con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
                resolve(id);
            });
        });
    
}

async function saveFiberPercentager(idFiber, percentage, idFabric){
    return new Promise(function(resolve, reject) {
        let stringQuery = `insert into percentage_fiber values (${idFiber},${percentage},${idFabric})`;   
        con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
                resolve(rows );
            });
        });

}

function savePicture(picture, idProuct, isMain, pictNum){
    let id;
    return new Promise(function(resolve, reject) {      
            let stringQuery = `INSERT INTO product_picture VALUES (${picture}, ${idProuct}, ${isMain})`;
            con.query(stringQuery, function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            })
}
//TODO MG: Que eran esos 1
function saveProduct(prod, idSizeCurve){
    let idProd;
    let order;
    let detail = prod.detail === undefined ? "" : prod.detail;
    let cost = prod.cost === undefined ? 0 : prod.cost;
    let costInStore = prod.costInStore === undefined ? 0 : prod.costInStore;
    return new Promise(function(resolve, reject) {
            let shipping = prod.idShipping === " " ? 3 : prod.idShipping;//TODO MG: ?? que es el 3?
            let stringQuery = `INSERT INTO product (ID, NAME, QUANTITY, WEIGHT, DETAIL, 
                               ID_INSPECTION, ID_MERCHANT, ID_COLLECTION, ID_TIPOLOGY, 
                               ID_MEASUREMENT_TABLE, ID_SIZE_CURVE, ID_CARE_LABEL, 
                               ID_SEASON, SHIPPING_DATE, ID_COUNTRY, ID_SHIPPING, 
                               ID_DESIGNER, ID_STATUS, COST, COST_IN_STORE, 
                               ID_COUNTRY_DESTINATION, ID_SUPPLIER, PRODUCT_ORDER,
                               ID_DEPARTMENT) VALUES (${prod.name}, ${prod.quantity},${prod.weight},${detail},
                                1, ${prod.idMerchant},${prod.idCollection},${prod.idTipology} , 1 ,${idSizeCurve},
                                1,${prod.idSeason},STR_TO_DATE("+ getFormattedDate(prod.shippingDate) + ", '%d,%m,%Y'),
                                ${prod.idCountry},${shipping},${prod.idDesigner}, 1,${cost},${costInStore},
                                ${prod.idCountryDestination},${prod.idSupplier},${order},${prod.idDepartment})`;     
            con.query(stringQuery, function (err, rows, fields) {
                    if (err) {

                        return reject(err);
                    }

                    resolve(idProd);
                });
            });
        
}

function getProuct(idProduct){
    return new Promise(function(resolve, reject) {                           
            let stringQuery = `SELECT * FROM product where id = ${idProduct}`;        
            con.query(stringQuery, function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            });
}

//TODO: MG Que es el 1
function saveComboAvio(idCombo,idAvio,idColor, idProduct, idStatus){
    let shortDate = new Date().toLocaleDateString();
    return new Promise(function(resolve, reject) {                                               
        let stringQuery = `INSERT INTO combo_avio values (${idCombo},${idAvio},${idColor},${idProduct},${idStatus},
                                                          ${shortDate}, 1)`;   

        con.query(stringQuery, function (err, rows, fields) { 
                if (err) {

                    return reject(err);
                }

                resolve(rows);
            });
        });
}

function getIdPrint(idPrint){
    return new Promise(function(resolve, reject) {     
        
        let stringQuery = `select * from printimpacta where id = ${idPrint}`;
        con.query(stringQuery, function (err, rows, fields) {
                if (err) {

                    return reject(err);
                }

                resolve(rows);
            });
        });
}

function savePrint(description, colorCount){
    return new Promise(function(resolve, reject) {                              
            let stringQuery = `insert into printimpacta values ( ${description},${colorCount})`;      

            con.query(stringQuery, function (err, rows, fields) {
                    if (err) {

                        return reject(err);
                    }

                    resolve(rows);
                });
            });
}
function saveComboFabric(idCombo, idFabric, idColor, idPrint, printDescription , colorCount, placement, idProduct, idStatus,i){
    return new Promise(function(resolve, reject) { 
                    savePrint(printDescription, colorCount).then(result =>{
                            insertComboFabric(idCombo + i, idFabric, idColor, idPrint, placement, idProduct, idStatus).then(result =>{
                                resolve(result);
                            });
                        }
                    );
                });
}
//TODO: MG Que son esos 1?
function insertComboFabric(idCombo, idFabric, idColor, idPrint, placement, idProduct, idStatus){
    let shortDate = new Date().toLocaleDateString();
    return new Promise(function(resolve, reject) {    
       
        let stringQuery = `INSERT INTO combo_fabric values (${idCombo},${idFabric},${idColor},${idPrint},${idProduct},
                                                            ${placement},1 , 1, ${shortDate},${shortDate},1,1,1,
                                                            ${shortDate},1)`;
        con.query(stringQuery, function (err, rows, fields) {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });

    });
}
function saveComboProduct(idProduct, quantity) {
    return new Promise(function(resolve, reject) {
                getComboId(idProduct).then(resultCombo => {//Este está OK?
                    if(resultCombo.length > 0){
                        var lastComboIdResult = resultCombo[0].id;
                        if(lastComboIdResult === null){
                            lastComboIdResult = 1;
                        }else{
                            lastComboIdResult = parseInt(lastComboIdResult) + 1;
                        }
                        let stringQuery = `into product_combo values (${idProduct},${lastComboIdResult},${quantity})`;     
                        con.query(stringQuery, function (err, rows, fields) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(lastComboIdResult);
                        });
                    }
                });     
    });
}




function getComboId(idProduct){
    return new Promise(function(resolve, reject) {                                               
            let stringQuery = `SELECT MAX(ID_COMBO) as id FROM PRODUCT_COMBO WHERE ID_PRODUCT = ${idProduct}`;      
            con.query(stringQuery, function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            });
}

function saveProductFabric(fabric, idProduct){
    return new Promise(function(resolve, reject) {                                                 
            let stringQuery = `insert into product_fabric values (${idProduct},${fabric.idFabric},${fabric.placement},
                               ${fabric.idColor},${(fabric.idPrint == undefined ? 0 : fabric.idPrint)})`;      
            con.query(stringQuery, function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            });
}

function getFormattedDate(strDate){
    let date = new Date(strDate);
    return "'" + date.getUTCDate() + "," + date.getUTCMonth() + "," + date.getUTCFullYear() + "'";
}

function getAvio(idAvio){
    return new Promise(function(resolve, reject) {                                                     
            let stringQuery = `SELECT * FROM AVIO WHERE ID IN (${idAvio})`;  
            con.query(stringQuery, function (err, rows, fields) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows);
                });
            });
}


function saveCombo(data){

}

module.exports.getMerchant = getMerchant;
module.exports.getMerchantSeason = getMerchantSeason;
module.exports.getMerchantDepartment = getMerchantDepartment;
module.exports.getMerchantDepartments = getMerchantDepartments;
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
module.exports.findTipology = findTipology;
module.exports.findStatus = findStatus;
module.exports.saveSizeCurve = saveSizeCurve;
module.exports.saveProduct = saveProduct;
module.exports.findDesigner = findDesigner;
module.exports.saveFabric = saveFabric;
module.exports.saveProductFabric = saveProductFabric;
module.exports.saveCombo = saveCombo;
module.exports.saveComboProduct = saveComboProduct;
module.exports.saveComboFabric = saveComboFabric;
module.exports.saveComboAvio = saveComboAvio;
module.exports.getAvio = getAvio;
module.exports.savePicture = savePicture;
module.exports.getProuct = getProuct;
module.exports.getFabrics = getFabrics;
module.exports.getFibers = getFibers;
module.exports.getPlacements = getPlacements;
module.exports.getTrims = getTrims;
module.exports.startTransaction = startTransaction;
module.exports.getFabricFromId = getFabricFromId;
module.exports.saveFiberPercentage = saveFiberPercentage;
module.exports.saveNewFabricInternal = saveNewFabricInternal;
module.exports.getFabricComposition = getFabricComposition;