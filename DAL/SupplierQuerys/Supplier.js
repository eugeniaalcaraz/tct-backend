const con = require("../configuration/ConfigurationDB");


function getSupplierPeopleCertifications() {
    let stringQuery = `SELECT DESCRIPTION description,TYPE type, SUBCATEGORY subcategory, COMMENT_GENERIC_PLANET commentGenericPlanet,
    COMMENT_GENERIC_QUIMICALS commentGenericQuimicals, COMMENT_GENERIC_MATERIALS commentGenericMaterials, 
    COMMENT_GENERIC_PEOPLE commentGenericPeople, IS_CHECKBOX isCheckbox, 'people' as category FROM PEOPLE_CERTIFICATION;`;
    return new Promise(function (resolve, reject) {
        console.log(stringQuery);
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

  function getSupplierPlanetCertifications() {
    let stringQuery = `SELECT DESCRIPTION description,TYPE type, SUBCATEGORY subcategory, COMMENT_GENERIC_PLANET commentGenericPlanet,
    COMMENT_GENERIC_QUIMICALS commentGenericQuimicals, COMMENT_GENERIC_MATERIALS commentGenericMaterials, 
    COMMENT_GENERIC_PEOPLE commentGenericPeople, 'planet' as category FROM PLANET_CERTIFICATION;`;
    return new Promise(function (resolve, reject) {
        console.log(stringQuery);
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


function getSupplierTypes() {
    let stringQuery = `SELECT ID id, DESCRIPTION description FROM SUPPLIER_TYPE;`;
    return new Promise(function (resolve, reject) {
        console.log(stringQuery);
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

  function getSupplierProductTypes() {
    let stringQuery = `SELECT ID id, DESCRIPTION description FROM SUPPLIER_PRODUCT_TYPE;`;
    return new Promise(function (resolve, reject) {
        console.log(stringQuery);
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


function saveSupplierCertifications(supplierId, certificationId, certificationType, certificationSubcategory) {
    let stringQuery = `INSERT INTO SUPPLIER_CERTIFICATIONS (ID_SUPPLIER, CERTIFICATION_ID, CERTIFICATION_TYPE, CERTIFICATION_SUBCATEGORY ) 
    VALUES (${supplierId}, ${certificationId}, '${certificationType}', '${certificationSubcategory}')`;
    return new Promise(function (resolve, reject) {
        console.log(stringQuery);
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          console.log(err);
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
	MEN_EMPLOYEES,TOTAL_EMPLOYEES, ID_MERCHANT, PERFORMANCE) VALUES (${data.supplierTypeId}, '${data.alias}', ${data.idCountry}, '${data.commercialName}',
        '${data.address}', '${data.contactPerson}', '${data.email}', ${date}, ${data.estimatedAnualOrder},
        ${data.anualContract}, ${data.employees.women},  ${data.employees.men},  ${data.employees.total}, ${data.idMerchant}, '${performance}')`;
    return new Promise(function (resolve, reject) {
        console.log(stringQuery);
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(rows.insertId);
      });
    });
  }

  function saveSupplierProductTypes(supplierId, productTypeId) {
    let stringQuery = `INSERT INTO SUPPLIER_PRODUCT_TYPES (ID_SUPPLIER,PRODUCT_TYPE_ID) VALUES (${supplierId}, ${productTypeId})`;
    return new Promise(function (resolve, reject) {
        console.log(stringQuery);
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(rows.insertId);
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
        console.log(stringQuery);
      con.query(stringQuery, function (err, rows, fields) {
        if (err) {
          console.log(err);
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