const con = require("../configuration/ConfigurationDB");


function getSupplierPeopleCertifications() {
    let stringQuery = `SELECT ID id,DESCRIPTION description,TYPE type, SUBCATEGORY subCat, COMMENT_GENERIC_PLANET commentGenericPlanet,
    COMMENT_GENERIC_QUIMICALS commentGenericQuimicals, COMMENT_GENERIC_MATERIALS commentGenericMaterials, 
    COMMENT_GENERIC_PEOPLE commentGenericPeople, IS_CHECKBOX isCheckbox, 'people' as category FROM PEOPLE_CERTIFICATION;`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        
        resolve(rows);
      });
    });
  }

  function getSupplierPlanetCertifications() {
    let stringQuery = `SELECT ID id, DESCRIPTION description,TYPE type, SUBCATEGORY subCat, COMMENT_GENERIC_PLANET commentGenericPlanet,
    COMMENT_GENERIC_QUIMICALS commentGenericQuimicals, COMMENT_GENERIC_MATERIALS commentGenericMaterials, 
    COMMENT_GENERIC_PEOPLE commentGenericPeople, 'planet' as category FROM PLANET_CERTIFICATION;`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        
        resolve(rows);
      });
    });
  }


function getSupplierTypes() {
    let stringQuery = `SELECT ID id, DESCRIPTION description FROM SUPPLIER_TYPE;`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        
        resolve(rows);
      });
    });
  }

  function getSupplierProductTypes() {
    let stringQuery = `SELECT ID id, DESCRIPTION description FROM SUPPLIER_PRODUCT_TYPE;`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        
        resolve(rows);
      });
    });
  }

function getSupplierCertifications(supplierId) {
    let stringQuery = `SELECT CERTIFICATION_ID id, 
                        CERTIFICATION_TYPE category, 
                        CERTIFICATION_SUBCATEGORY subCat 
                        FROM SUPPLIER_CERTIFICATIONS
                        WHERE ID_SUPPLIER = ${supplierId}`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  function getSuppliersCertifications(supplierId) {
    let stringQuery = `SELECT 
                        ID idSupplier,
                        CERTIFICATION_ID id, 
                        CERTIFICATION_TYPE category, 
                        CERTIFICATION_SUBCATEGORY subCat 
                        FROM SUPPLIER_CERTIFICATIONS
                        WHERE ID_SUPPLIER IN ${supplierId}`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

function saveSupplierCertifications(supplierId, certificationId, certificationType, certificationSubcategory) {
    let stringQuery = `INSERT INTO SUPPLIER_CERTIFICATIONS (ID_SUPPLIER, CERTIFICATION_ID, CERTIFICATION_TYPE, CERTIFICATION_SUBCATEGORY ) 
    VALUES (${supplierId}, ${certificationId}, '${certificationType}', '${certificationSubcategory}')`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows.insertId);
      });
    });
  }

  
function deleteSupplierCertifications(supplierId) {
    let stringQuery = `DELETE FROM SUPPLIER_CERTIFICATIONS WHERE ID_SUPPLIER = ${supplierId}`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows.insertId);
      });
    });
  }

  function updateSupplier(data, performance) {

    var dataAdded = false;
    let stringQuery = "UPDATE SUPPLIER_DEVELOP SET ";

    if(data.alias !== undefined && data.alias !== null){
        stringQuery += ` ALIAS = '${data.alias}'`;
        dataAdded = true;
    };
    if(data.commercialName !== undefined && data.commercialName !== null){
        dataAdded = true;
        if(!dataAdded){
            stringQuery += ` COMMERCIAL_NAME = '${data.commercialName}'`;
        }else{
            stringQuery += `, COMMERCIAL_NAME = '${data.commercialName}'`;;
        }
    };
    if(data.address !== undefined && data.address !== null){
        dataAdded = true;
        if(!dataAdded){
            stringQuery += ` ADDRESS = '${data.address}' `;
        }else{
            stringQuery += `, ADDRESS = '${data.address}' `;
        }
    };
    if(data.contactPerson !== undefined && data.contactPerson !== null){
        dataAdded = true;
        if(!dataAdded){
            stringQuery += ` CONTACT_PERSON = '${data.contactPerson}'`;
        }else{
            stringQuery += `, CONTACT_PERSON = '${data.contactPerson}'`;
        }
    };
    if(data.email !== undefined && data.email !== null){
        if(!dataAdded){
            stringQuery += ` EMAIL = '${data.email}'`;
        }else{
            stringQuery += `, EMAIL = '${data.email}'`;
        }
    };
    if(data.commercialRelationDate !== undefined && data.commercialRelationDate !== null){
        if(!dataAdded){
            stringQuery += " COMMERCIAL_RELATION_DATE = " + getFormattedDate(data.commercialRelationDate);
        }else{
            stringQuery += ", COMMERCIAL_RELATION_DATE = " + getFormattedDate(data.commercialRelationDate);
        }
    };
    if(data.estimatedAnualOrder !== undefined && data.estimatedAnualOrder !== null){
        if(!dataAdded){
            stringQuery += " ESTIMATED_ANUAL_ORDER = " + data.estimatedAnualOrder;
        }else{
            stringQuery += ", ESTIMATED_ANUAL_ORDER = " + data.estimatedAnualOrder;
        }
    };
    if(data.anualContract !== undefined && data.anualContract !== null){
        if(!dataAdded){
            stringQuery += " ANUAL_CONTRACT = " + data.anualContract ? 1 : 0;
        }else{
            stringQuery += ", ANUAL_CONTRACT = " + data.anualContract ? 1 : 0;
        }
    };
    if(data.employees.women !== undefined){
        if(!dataAdded){
            stringQuery += " WOMEN_EMPLOYEES = " + data.employees.women;
        }else{
            stringQuery += ", WOMEN_EMPLOYEES = " + data.employees.women;
        }
    };
    if(data.employees.men !== undefined){
        if(!dataAdded){
            stringQuery += " MEN_EMPLOYEES = " + data.employees.men;
        }else{
            stringQuery += ", MEN_EMPLOYEES = " + data.employees.men;
        }
    };
    if(data.employees.total !== undefined && data.employees.total !== null){
        if(!dataAdded){
            stringQuery += " TOTAL_EMPLOYEES = " + data.employees.total;
        }else{
            stringQuery += ", TOTAL_EMPLOYEES = " + data.employees.total;
        }
    };
    if(performance !== undefined && performance !== null){
        if(!dataAdded){
            stringQuery += " PERFORMANCE = " + performance;
        }else{
            stringQuery += ", PERFORMANCE = " + performance;
        }
    };

    stringQuery += " WHERE ID = " + data.id;

    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows.insertId);
      });
    });
  }


function saveSupplier(data, performance) {
    var date =  getFormattedDate(data.commercialRelationDate);
    let stringQuery = `INSERT INTO SUPPLIER_DEVELOP (SUPPLIER_TYPE_ID, ALIAS,ID_COUNTRY,COMMERCIAL_NAME,ADDRESS,
	CONTACT_PERSON, EMAIL, COMMERCIAL_RELATION_DATE, ESTIMATED_ANUAL_ORDER,HAS_ANUAL_CONTRACT,WOMEN_EMPLOYEES,
	MEN_EMPLOYEES,TOTAL_EMPLOYEES, ID_MERCHANT, PERFORMANCE, VAT_NUMBER) VALUES (${data.supplierTypeId}, '${data.alias}', ${data.idCountry}, '${data.commercialName}',
        '${data.address}', '${data.contactPerson}', '${data.email}', ${date}, ${data.estimatedAnualOrder},
        ${data.anualContract}, ${data.employees.women},  ${data.employees.men},  ${data.employees.total}, ${data.idMerchant}, '${performance}', ${data.vatNumber})`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows.insertId);
      });
    });
  }


  function getSupplier(idSupplier) {
    let stringQuery = `SELECT SUPPLIER_TYPE_ID supplierTypeId, ALIAS alias,ID_COUNTRY idCountry,COMMERCIAL_NAME commercialName,
    ADDRESS address, CONTACT_PERSON contactPerson, EMAIL email, COMMERCIAL_RELATION_DATE commercialRelationDate, 
    ESTIMATED_ANUAL_ORDER estimatedAnualOrder,HAS_ANUAL_CONTRACT anualContract,WOMEN_EMPLOYEES womenEmployees,
	MEN_EMPLOYEES menEmployees,TOTAL_EMPLOYEES totalEmployees, ID_MERCHANT idMerchant, PERFORMANCE performance, VAT_NUMBER vatNumber FROM SUPPLIER_DEVELOP WHERE ID = ${idSupplier}`;
    return new Promise(function (resolve, reject) {
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
  function deleteProductTypes(idSupplier){
    function saveSupplierProductTypes(supplierId, productTypeId) {
        let stringQuery = `DELETE SUPPLIER_PRODUCT_TYPES WHERE ID_SUPPLIER = ${supplierId}`;
        return new Promise(function (resolve, reject) {
            
          con.query(stringQuery, function (err, rows, fields) {
            if (err) {
              
              return reject(err);
            }
            resolve(rows.insertId);
          });
        });
      }
  }
  function saveSupplierProductTypes(supplierId, productTypeId) {
    let stringQuery = `INSERT INTO SUPPLIER_PRODUCT_TYPES (ID_SUPPLIER,PRODUCT_TYPE_ID) VALUES (${supplierId}, ${productTypeId})`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows.insertId);
      });
    });
  }

  function getProductTypesForSupplierId(supplierId) {
    let stringQuery = `SELECT ID_SUPPLIER idSupplier,PRODUCT_TYPE_ID productTypeId FROM SUPPLIER_PRODUCT_TYPES WHERE ID_SUPPLIER = ${supplierId}`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  function getProductTypesForSuppliersId(supplierId) {
    let stringQuery = `SELECT ID_SUPPLIER idSupplier,
                       PRODUCT_TYPE_ID productTypeId 
                       FROM SUPPLIER_PRODUCT_TYPES WHERE ID_SUPPLIER IN ${supplierId}`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
  
  function getFormattedDate(strDate) {
    let date = new Date(strDate);
    let year = date.getUTCFullYear();
    let month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Agrega un cero inicial si el mes es de un solo dígito
    let day = date.getUTCDate().toString().padStart(2, '0'); // Agrega un cero inicial si el día es de un solo dígito
    return `'${year}-${month}-${day}'`;
  }


  function getSupplierPerformanceRules() {
    let stringQuery = `SELECT ID Id, PERFORMANCE Performance, RULE Rule FROM SUPPLIER_PERFORMANCE_CONFIGURATION`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  function getSupplierForFilter(idMerchant) {
    let stringQuery = `
    SELECT S.ID id, S.PERFORMANCE performance, S.ALIAS alias, 
    ST.DESCRIPTION supplierType, S.COMMERCIAL_NAME commercialName, 
    C.NAME Country, S.CONTACT_PERSON contactPerson, S.EMAIL email, 
    S.TOTAL_EMPLOYEES totalEmployees, C.HIGH_RISK_NO_COMPLIANCE countryInHighRisk
    FROM SUPPLIER_DEVELOP S
    INNER JOIN SUPPLIER_TYPE ST ON S.SUPPLIER_TYPE_ID = ST.ID
    INNER JOIN COUNTRY C ON S.ID_COUNTRY = C.ID
    WHERE S.ID_MERCHANT = ${idMerchant};`;
    return new Promise(function (resolve, reject) {
        
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
module.exports.saveSupplier = saveSupplier;
module.exports.saveSupplierProductTypes = saveSupplierProductTypes;
module.exports.saveSupplierCertifications = saveSupplierCertifications;
module.exports.getSupplierPerformanceRules = getSupplierPerformanceRules;
module.exports.getSupplierTypes = getSupplierTypes;
module.exports.getSupplierProductTypes = getSupplierProductTypes;
module.exports.getSupplierPeopleCertifications = getSupplierPeopleCertifications;
module.exports.getSupplierPlanetCertifications = getSupplierPlanetCertifications;
module.exports.getSupplier = getSupplier;
module.exports.getProductTypesForSupplierId = getProductTypesForSupplierId;
module.exports.getSupplierCertifications = getSupplierCertifications;
module.exports.updateSupplier = updateSupplier;
module.exports.deleteProductTypes = deleteProductTypes;
module.exports.deleteSupplierCertifications = deleteSupplierCertifications;
module.exports.getSupplierForFilter = getSupplierForFilter;
module.exports.getSuppliersCertifications = getSuppliersCertifications;
module.exports.getProductTypesForSuppliersId = getProductTypesForSuppliersId;