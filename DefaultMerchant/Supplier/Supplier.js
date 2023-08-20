const supplierRepository = require('../../DAL/SupplierQuerys/Supplier');
const merchantRepository = require('../../DAL/MerchantQuerys/Merchant');
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
        // const peopleModArray = peopleCertifications.map(item => ({
        //     ...item,
        //     cat: 'people'
        //   }));
        var planetCertifications = await supplierRepository.getSupplierPlanetCertifications();
        return {'supplierTypes': supplierTypes,
                'supplierProductTypes': supplierProductTypes,
                'countries': countries,
                'peopleCertifications':  peopleCertifications,
                'planetCertifications': planetCertifications};
    }

    async getSupplier(idSupplier){
        return new Promise(async function(resolve, reject){
        console.log("Buscando el proveedor: " +  idSupplier);
        var supplierBasicData = await supplierRepository.getSupplier(idSupplier);
        var supplierProductTypes = await supplierRepository.getProductTypesForSupplierId(idSupplier);
        var supplierCertifications = await supplierRepository.getSupplierCertifications(idSupplier);
        console.log(supplierBasicData);
        console.log(supplierProductTypes);

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
                category: item.category === "1" ? "planet" : "people"
              }))
        })    

        });
    }


    saveSupplier(data){
        return new Promise(async function(resolve, reject){
            try{
                validateObligatoryData(data);
                validateOptionalData(data);
                var performanceRules = await getSupplierPerformanceConfiguration();
                var performance = determinePerformance(data.certifications, performanceRules);
                const supplierId = await saveSupplierBasicData(data, performance);
                await saveSupplierProductTypes(supplierId, data);
                await saveSupplierCertifications(supplierId, data);
            }catch(exception){
                console.log("holaaaa")
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
  console.log("certific")
  console.log(certifications);
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
    console.log("performanceRules")
    console.log(performanceRules);
  for (const rule of performanceRules) {
    console.log("r")
    console.log(rule);
    const ruleSubCats = rule.Rule.split('-');
    console.log(ruleSubCats);
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
    console.log("comb")
    console.log(combinations);
    const performances = combinations.map(combination => findMatchingPerformance(combination, performanceRules));
    console.log("perf")
    console.log(performances);
    const highestPriorityPerformance = getHighestPriorityPerformance(performances);
    console.log("highestPriorityPerformance")
    console.log(highestPriorityPerformance);
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
            console.log(ex);
        }
    });
}
async function saveSupplierCertifications(supplierId, data) {
    await new Promise(function(resolve, reject) {
    try {
        const certfications = data.certifications; 
        for (const certification of certfications) {
                var type = certification.type === 'planet' ? 1 : 2;
                supplierRepository.saveSupplierCertifications(supplierId, certification.id,type, certification.subCat)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(error => {
                        console.log("hola")
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


function validateOptionalData(data){
    validateCommercialName(data.commercialName);
    validateAddress(data.address);
    validateOrderEstimate(data.estimatedAnualOrder);

}
function validateOrderEstimate(estimatedAnualOrder){
    if(estimatedAnualOrder !== undefined){
        console.log(estimatedAnualOrder);
        if(isNaN(estimatedAnualOrder)){
            console.log("hola")
            throw new Error("El pedido estimado anual debe de ser numerico");
        }
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
function validateObligatoryData(data){
    validateMerchant(data.idMerchant);
    validateSupplierType(data.supplierTypeId);
    validateAlias(data.alias);
    validateVatNumber(data.vatNumber);
    validateIdCountry(data.idCountry);
    validateAnualContract(data.anualContract);
    validateProductTypes(data.productTypes);
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
        console.log(employees.total);
        throw new Error("Total invalido");
    }else if(employees.women < 0){
        throw new Error("Cantidad de personal femenino invalido");
    }else if(employees.men < 0){
        throw new Error("Cantidad de personal masculino invalido");
    }else if(employees.women > 0 && employees.men > 0 && (employees.men + employees.women) !== employees.total){
        throw new Error("El total de empleados no coincide con los subtotales ingresados");
    }
} 
function validateAnualContract(anualContract){
    if(anualContract === undefined){
        throw new Error("Debe indicar si cuenta con un contrato de tipo anual");
    }else if(anualContract !== true && anualContract !== false){
        console.log(anualContract);
        throw new Error("El contrato anual debe ser un valor booleano");
    }
}
function validateIdCountry(idCountry){
    if(idCountry === undefined){
        throw new Error("Debe ingresar un país");
    }else if(idCountry < 1){
        console.log(idCountry)
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