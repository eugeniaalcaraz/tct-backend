const supplierRepository = require('../../DAL/SupplierQuerys/Supplier');
const merchantRepository = require('../../DAL/MerchantQuerys/Merchant');
const { differenceInYears } = require("date-fns");
const iconv = require('iconv-lite');

module.exports = class ImpactaSupplier {
    constructor () {

    }



    async getSupplierFormInfo(){
        var supplierInfo;
        var supplierTypes = await supplierRepository.getSupplierTypes();
        var supplierProductTypes = await supplierRepository.getSupplierProductTypes();
        var countries = await merchantRepository.getCountries();
        var peopleCertifications = await supplierRepository.getSupplierPeopleCertifications();
        var planetCertifications = await supplierRepository.getSupplierPlanetCertifications();
        var processCertifications = await supplierRepository.getSupplierProcessCertifications();

        return {'supplierTypes': supplierTypes,
                'supplierProductTypes': supplierProductTypes,
                'countries': countries,
                'peopleCertifications':  peopleCertifications,
                'planetCertifications': planetCertifications,
                'processCertifications': processCertifications};
    }
    async getAllSuppliersForMerchant(idMerchant, score, alias, origin, type, product){
        if(idMerchant === undefined){
            return "Debe ingresar un merchant";
        }
        var basicInfo = await supplierRepository.getSupplierForFilter(idMerchant,score, alias, origin,type);
        var result = basicInfo;
        if(basicInfo.length > 0){
            var supplierIds = basicInfo.map(item => item.id.toString()).join(',');        
            var supplierPlanetCertifications = await supplierRepository.getSupplierPlanetCertifications(supplierIds);//supplierRepository.getSupplierPeopleCertifications(supplierIds);
            var supplierPeopleCertifications = await supplierRepository.getSupplierPeopleCertifications(supplierIds);
            var supplierProcessCertifications = await supplierRepository.getSupplierProcessCertifications(supplierIds); 
            var supplierProductTypes = await supplierRepository.getProductTypesForSuppliersId(supplierIds, product);
                result = await basicInfo.map( a => {
                    const peopleCertifications = supplierPeopleCertifications.filter(b => b.idSupplier === a.id);
                    const planetCertifications = supplierPlanetCertifications.filter(b => b.idSupplier === a.id);              
                    const processCertifications = supplierProcessCertifications.filter(b => b.idSupplier === a.id);            
                    const productTypes = supplierProductTypes.filter(p => p.idSupplier === a.id);
                    const commRelationship = GetCommercialRelationship(a);
                    Object.defineProperty(a, 'countryInHighRisk', {
                        value: a.countryInHighRisk === 1 ? true : false,
                        writable: true // Make sure it is writable
                      });
                    return { ...a, commercialRelationship: commRelationship,planetCertifications: Array.from(planetCertifications),peopleCertifications: Array.from(peopleCertifications), processCertifications: Array.from(processCertifications), productTypes: Array.from(productTypes) };
                    // or return { ...a, certifications: [...certifications] };
                  });
        }


        return result;
    }
 
    async getSupplier(idSupplier){
        return new Promise(async function(resolve, reject){
        var supplierBasicData = await supplierRepository.getSupplier(idSupplier);
        var supplierProductTypes = await supplierRepository.getProductTypesForSupplierId(idSupplier);
        var supplierCertifications = await supplierRepository.getSupplierCertifications(idSupplier);

        resolve({
            'supplierTypeId': supplierBasicData[0].supplierTypeId,
            'alias': supplierBasicData[0].alias,
            'idCountry':  supplierBasicData[0].idCountry,
            'commercialName':  supplierBasicData[0].commercialName,
            'address': supplierBasicData[0].address,
            'contactPerson': supplierBasicData[0].contactPerson,
            'email':  supplierBasicData[0].email,
            'commercialRelationDate': supplierBasicData[0].commercialRelationDate,
            'estimatedAnualOrder': supplierBasicData[0].estimatedAnualOrder,
            'anualContract':  supplierBasicData[0].anualContract === 1 ? true : false,
            'womenEmployees': supplierBasicData[0].womenEmployees,
            'menEmployees': supplierBasicData[0].menEmployees,
            'totalEmployees': supplierBasicData[0].totalEmployees,
            'idMerchant': supplierBasicData[0].idMerchant,
            'performance': supplierBasicData[0].performance,
            'productTypes': supplierProductTypes.map(item => item.productTypeId),
            'supplierCertifications': supplierCertifications.map(item => ({
                ...item,
                category: getCertificationCategory(item.category)
              }))
        })    

        });
    }
     

    updateSupplier(data){
        return new Promise(async function(resolve, reject){
            var performance = null;
            try{
                validateObligatoryDataForUpdate(data);
                validateOptionalDataForUpdate(data);
                if(data.id === undefined && data.id === null){
                    reject("Debe ingresar el id del proveedor que esta tratando de modificar.");
                };
                if(data.productTypes !== undefined && data.productTypes !== null){
                    supplierRepository.deleteProductTypes(data.id);
                    await saveSupplierProductTypes(data.id, data);
                };
                if(data.certification !== undefined && data.certification !== null){
                    supplierRepository.deleteSupplierCertifications(data.id);
                    var performanceRules = await getSupplierPerformanceConfiguration();
                    performance = determinePerformance(data.certifications.filter(x => x.category === "people" || x.category === "planet"), performanceRules);
                    await saveSupplierCertifications(data.id, data);
                };
                supplierRepository.updateSupplier(data, performance);
            }catch(exception){
                reject(exception.toString());
            }
            resolve(true);
        });
    }


    saveSupplier(data){
        return new Promise(async function(resolve, reject){
            try{
                validateObligatoryData(data);
                validateOptionalData(data);
                var performanceRules = await getSupplierPerformanceConfiguration();
                var performance = determinePerformance(data.certifications.filter(x => x.category === "people" || x.category === "planet"), performanceRules);
                const supplierId = await saveSupplierBasicData(data, performance);
                await saveSupplierProductTypes(supplierId, data);
                await saveSupplierCertifications(supplierId, data);
            }catch(exception){
                reject(exception.toString());
            }
            resolve(true);
        });

    }
}

const prioritizePerformance = ['A', 'B', 'C', 'D'];

// Generate all possible combinations of certifications
function generateCombinations(certifications) {
  const result = [[]];
  for (const cert of certifications) {
    const current = [...result];
    for (const combo of current) {
      result.push(combo.concat(cert.subCat));
    }
  }
  return result;
}

// Find the matching performance for a combination of subCategories
function findMatchingPerformance(combination, performanceRules) {
  for (const rule of performanceRules) {
    const ruleSubCats = rule.Rule.split('-');
    if (ruleSubCats.every(subCat => combination.includes(subCat))) {
      return rule.Performance;
    }
  }
  return null;
}

// Get the highest prioritized performance from the list
function getHighestPriorityPerformance(performances) {
  for (const priority of prioritizePerformance) {
    if (performances.includes(priority)) {
      return priority;
    }
  }
  return null;
}

// Main function to determine performance based on certifications
function determinePerformance(certifications, performanceRules) {
  if(certifications.length > 0){
    const combinations = generateCombinations(certifications);
    const performances = combinations.map(combination => findMatchingPerformance(combination, performanceRules));
    const highestPriorityPerformance = getHighestPriorityPerformance(performances);
    return highestPriorityPerformance;
  }
  return 'D';

}

async function getSupplierPerformanceConfiguration(){
    return new Promise(function(resolve, reject){
    try{
        supplierRepository.getSupplierPerformanceRules().then(result => {
            if(result.length < 1){
                reject("No existen configuraciones para calificar la performance de los proveedores");
            }
            resolve(result);
        });
    }catch(ex){
        reject(ex);
    }
});
}

async function saveSupplierBasicData(data, performance){
    return new Promise(function(resolve, reject){
        try{
            supplierRepository.saveSupplier(data, performance).then(result => {
                resolve(result);
            });
        }catch(ex){
            reject(ex);
        }
    });
}
async function saveSupplierCertifications(supplierId, data) {
    await new Promise(function(resolve, reject) {
    try {
        const certfications = data.certifications;
        for (const certification of certfications) {
                var type;
                if(certification.category === 'planet'){
                    type = 1;
                }else if(certification.category === 'people'){
                    type = 2;
                }else{
                    type = 3;
                    certification.subCat = '-';
                }
                supplierRepository.saveSupplierCertifications(supplierId, certification.id, type, certification.subCat)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
        }
    } catch (ex) {
        reject(ex);
    }
    });
}
async function saveSupplierProductTypes(supplierId, data) {
    try {
        const productTypes = data.productTypes; 
        for (const productTypeId of productTypes) {
            await new Promise(function(resolve, reject) {
                supplierRepository.saveSupplierProductTypes(supplierId, productTypeId)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    } catch (ex) {
        console.log(ex);
    }
}

function validateOptionalDataForUpdate(data){
    if(data.commercialName !== undefined && data.commercialName !== null){
        validateCommercialName(data.commercialName);
    }
    if(data.address !== undefined && data.address !== null){
        validateAddress(data.address);
    }
    if(data.estimatedAnualOrder !== undefined && data.estimatedAnualOrder !== null){
        validateOrderEstimate(data.estimatedAnualOrder);
    }
}
function validateOptionalData(data){
    validateCommercialName(data.commercialName);
    validateAddress(data.address);
    validateOrderEstimate(data.estimatedAnualOrder);
}
function validateOrderEstimate(estimatedAnualOrder){
    if(estimatedAnualOrder !== undefined){
        if(isNaN(estimatedAnualOrder)){
            throw new Error("El pedido estimado anual debe de ser numerico");
        }
    }
}
function getCertificationCategory(value) {
    if(value === '1'){
        return "planet";
    }else if(value === "2"){
        return "people";
    }else{
        return "process";
    }
}

function validateCommercialName(commercialName){
    if(commercialName !== undefined){
        if(!isNaN(commercialName)){
            throw new Error("El nombre comercial debe ser de tipo texto");
        }
    }
}
function validateAddress(address){
    if(address !== undefined){
        if(!isNaN(address)){
            throw new Error("La dirección debe ser de tipo texto");
        }
    }
}
function validateObligatoryDataForUpdate(data){
    if(data.supplierType !== undefined && data.supplierType !== null){
        validateSupplierType(data.supplierTypeId);
    }
    if(data.alias !== undefined && data.alias !== null){
        validateAlias(data.alias);
    }
    if(data.vatNumber !== undefined && data.vatNumber !== null){
        validateVatNumber(data.vatNumber);
    }
    if(data.idCountry !== undefined && data.idCountry !== null){
        validateIdCountry(data.idCountry);
    }
    if(data.anualContract !== undefined && data.anualContract !== null){
        validateAnualContract(data.anualContract);
    }
    if(data.productTypes !== undefined && data.productTypes !== null){
        validateProductTypes(data.productTypes);
    }
    if(data.employees !== undefined && data.employees !== null){
        validateEmployees(data.employees);
    }
}
function validateObligatoryData(data){
    validateMerchant(data.idMerchant);
    validateSupplierType(data.supplierTypeId);
    validateAlias(data.alias);
    validateVatNumber(data.vatNumber);
    validateIdCountry(data.idCountry);
    validateAnualContract(data.anualContract);
    validateProductTypes(data.productTypes);
    validateEmployees(data.employees);
}

function validateProductTypes(productTypes) {
    if (!Array.isArray(productTypes) || productTypes.length === 0) {
        throw new Error("La lista de tipos de producto está vacía o no es un arreglo");
    }

    const nonNumberProductType = productTypes.find(productTypeId => typeof productTypeId !== 'number');
    if (nonNumberProductType) {
        throw new Error("Cada tipo de producto debe ser un número");
    }
}
function validateEmployees(employees){
    if(employees === undefined){
        throw new Error("Debe ingresar la información correspondiente al personal");
    }else if(employees.total === undefined || employees.total < 1){
        throw new Error("Total invalido");
    }else if(employees !== null && employees.women < 0){
        throw new Error("Cantidad de personal femenino invalido");
    }else if(employees !== null && employees.men < 0){
        throw new Error("Cantidad de personal masculino invalido");
    }else if(employees.women > 0 && employees.men > 0 && (employees.men + employees.women) !== employees.total){
        throw new Error("El total de empleados no coincide con los subtotales ingresados");
    }
} 
function validateAnualContract(anualContract){
    if(anualContract === undefined){
        throw new Error("Debe indicar si cuenta con un contrato de tipo anual");
    }else if(anualContract !== true && anualContract !== false){
        throw new Error("El contrato anual debe ser un valor booleano");
    }
}
function validateIdCountry(idCountry){
    if(idCountry === undefined){
        throw new Error("Debe ingresar un país");
    }else if(idCountry < 1){
        throw new Error("País invalido");
    }
}
function validateVatNumber(vatNumber){
    if(vatNumber === undefined){
        throw new Error("Debe ingresar un número VAT");
    }
}
function validateSupplierType(supplierTypeId){
    if(supplierTypeId === undefined){
        throw new Error("Debe ingresar un tipo de proveedor");
    }
}
function validateAlias(alias){
    if(alias === undefined){
        throw new Error("Debe ingresar un tipo de proveedor");
    }else if(!isNaN(alias)){
        throw new Error("El Alias del proveedor debe ser un texto");
    }
}
function validateMerchant(idMerchant){
    if(idMerchant === undefined){
        throw new Error("Debe ingresar un id de comercio al que pertenece el proveedor");
    }
}

function GetCommercialRelationship(a){
    const providedDate = new Date(a.relationShipDate);
    const currentDate = new Date();
    const yearsDifference = differenceInYears(currentDate, providedDate);
    if(a.hasAnualContract === 1){
        if(yearsDifference < 3){
            return 'En vías de consolidarse';
        }else{
            return 'Consolidada';
        }
    }else{
        if(yearsDifference < 3){
            return 'Reciente';
        }else if(yearsDifference > 5){
            return 'Muy consolidada';
        }else{
            return 'En vías de consolidarse';
        }
    }
}