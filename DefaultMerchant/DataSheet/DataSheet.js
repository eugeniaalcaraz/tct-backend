var ProductDTO = require("./ProductDTO");
var merchantRepository = require("../../DAL/MerchantQuerys/Merchant");
var pako = require('pako');

const sizeCurveEnum = {
  shoe: 1,
  clothes: 2,
  denim: 3
};

module.exports = class ImpactaDataSheet {
  constructor() {}

  sayHello() {
    return "Hi from Impacta DataSheet!";
  }
  async updateProduct(data) {
    console.log("update product");
    const self = this; // Almacenar referencia al contexto de this
    let product = await merchantRepository.getProduct(data.idProduct);
    console.log(product.length);
    return new Promise(async function(resolve, reject) {
    if(product.length > 0){
        await self.saveNewProduct(data).then(result => {
          if(result){
            merchantRepository.deleteComboFabricColor(data.idProduct).then(result => {
              merchantRepository.deleteComboFabricPrint(data.idProduct).then(result => {
                merchantRepository.deleteComboFabric(data.idProduct).then(result => {
                  merchantRepository.deleteProductData(data.idProduct).then(result => {
                    merchantRepository.deleteProductPicture(data.idProduct).then(async result => {
                        resolve(true);
                    });
                  })
                });
              });
            });
          }
        });   
    }else{
       resolve("El id del producto ingresado no existe");
    }
  })
  }

  async saveNewProduct(data) {
    data.result = true;
    try {
      return new Promise(async function (resolve, reject) {
        let idProduct;
        if (data.idExistingProduct != 0) {
        } else {
          try {//Valido los datos de los combos - podemos sacarlo para mayor eficiencia
            validateData(data);
            await findCountry(data.idCountry);
            await findTIPOLOGY(data.idTipology);
          } catch (exception) {
            console.log(exception)
            reject(exception.toString());
            return;
          }
        }
        let prodNumber; 
        try{
          if(data.idProduct > 0){
            prodNumber = data.productNumber;
          }else{
            prodNumber = await merchantRepository.getProductNumber(data.idSeason);
          }
        }catch(exception){
           prodNumber = await merchantRepository.getProductNumber(data.idSeason);
        }
        
        idProduct = await saveProduct(data, prodNumber);
        await savePictures(data, idProduct);
        let savedFabrics = await saveFabrics(data);
        let managmentUnit = await merchantRepository.getManagmentUnit(data.idManagmentUnit);

        if(data.idShoeMaterial > 0){
          if(managmentUnit[0].NAME  !== "Shoes"){
            data.result = false;
            reject("Si se ingreso un material de zapatos la tipología debe corresponder a zapatos");
          }else{
            merchantRepository.insertShoeMaterialProd(data.idShoeMaterial, idProduct);
          }
        }
        try{
          await handleFabricCombo2(savedFabrics, idProduct, data);
          await handleAvioCombo(idProduct, data, savedFabrics);
          resolve(true);
        }catch(exception){
          merchantRepository.deleteComboFabricColor(idProduct).then(result => {
            merchantRepository.deleteComboFabricPrint(idProduct).then(result => {
              merchantRepository.deleteComboFabric(idProduct).then(result => {
                merchantRepository.deleteProductData(idProduct).then(result => {
                  merchantRepository.deleteProductPicture(idProduct).then(async result => {
                    console.log("fatal error");
                    console.log(exception);
                    resolve(false);
                  });
                })
              });
            });
          });

        }
      });
    } catch (exception) {
      return new Promise(function (resolve, reject) {
        //merchantRepository.rollback();
        reject(exception.message);
      });
    }
  }



};
async function saveComboFabric(savedFabrics, idProduct, data) {
  console.log("001");

  let fabricComboPromises = savedFabrics.map(async (fab, i) =>
    await merchantRepository.insertComboFabric2(fab, idProduct)
  );

  return new Promise((resolve, reject) => {
    Promise.all(fabricComboPromises)
      .then((results) => {
        const insertedIdsWithData = results.map((comboFabricReturns) => ({
          insertedId: comboFabricReturns.id, // Replace 'id' with the correct property name for the inserted ID
          data: comboFabricReturns.fabric, // Replace 'data' with the correct property name for the data
        }));
        resolve(insertedIdsWithData);
        console.log(insertedIdsWithData);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  });
}

async function handleFabricCombo2(savedFabrics, idProduct, data) {
  try {
    insertedCombos = await saveComboFabric(savedFabrics, idProduct, data);

    await Promise.all(
      insertedCombos.map(async (combo) => {
        for (const p of combo.data.prints) {
          const combosWithIdPrint = await merchantRepository.savePrint2(combo, p.description, p.colorCount);
          const idSizeCurve = await saveSizeCurveDatasheet(c.sizeCurve, data.sizeCurve);
          await merchantRepository.savePrintFabricCombo2(combosWithIdPrint.combo, combosWithIdPrint.idPrint, combo.data.idStatus, idSizeCurve);
        }
      })
    );

    await Promise.all(
      insertedCombos.map(async (combo) => {
        for (const c of combo.data.colors) {
          const idSizeCurve = await saveSizeCurveDatasheet(c.sizeCurve, data.sizeCurveType);
          await merchantRepository.saveColorFabricCombo2(combo.insertedId, c.idColor, combo.data.idStatus, idSizeCurve);
        }
      })
    );

  } catch (ex) {
    console.log("hola exe");
    throw ex;
  }
}
async function saveComboAvio(idProduct, data, savedFabrics) {
  console.log("001");

  let avioComboPromises = data.avios.map(async (av, i) =>
    await merchantRepository.saveComboAvio(av, idProduct, savedFabrics[0].entryDate, 
                                           savedFabrics[0].warehouseEntryDate, savedFabrics[0].shippingDate,
                                           savedFabrics[0].idShipping, savedFabrics[0].idCountryDestination)
  );

  return new Promise((resolve, reject) => {
    Promise.all(avioComboPromises)
      .then((results) => {
        const insertedIdsWithData = results.map((comboAviosReturns) => ({
          insertedId: comboAviosReturns.id, // Replace 'id' with the correct property name for the inserted ID
          data: comboAviosReturns.avio, // Replace 'data' with the correct property name for the data
        }));
        resolve(insertedIdsWithData);
        console.log(insertedIdsWithData);
      })
      .catch((error) => {
        console.error('Error:', error);
        reject(error);
      });
  });
}
async function handleAvioCombo(idProduct, data, savedFabrics) {
  try {
    insertedCombos = await saveComboAvio(idProduct, data, savedFabrics);
    console.log(insertedCombos);
    await Promise.all(

      insertedCombos.map(async (combo) => {
        for (const c of combo.data.colors) {
          await merchantRepository.saveComboAvioColor(combo.insertedId, c.idColor, combo.data.idStatus);
        }
      })
    );

  } catch (ex) {
    console.log("hola exe");
    throw ex;
  }
}
async function saveSizeCurveDatasheet(sizeCurve, idSizeCurveType){
  console.log(sizeCurve);
  console.log(idSizeCurveType);
  try{
    if(idSizeCurveType === sizeCurveEnum.shoe){
      return await merchantRepository.saveSizeCurveShoes2(data.sizeCurveType);
    }else if(idSizeCurveType === sizeCurveEnum.clothes){
      return await merchantRepository.saveSizeCurveClothes2(sizeCurve);
    }else{
      console.log("es denim")
      return await merchantRepository.saveSizeCurveDenim2(sizeCurve);
    }
  }catch(ex){
    console.log("salio algo mal guardando la curva de talles")
    throw(ex);
  }

}

async function getProduct(idProduct) {
  try {
    const result = await merchantRepository.getProduct(idProduct);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("Error - El producto enviado no existe.");
    }
  } catch (error) {
    throw error;
  }
}

async function handleFabricCombo(savedFabrics, idProduct, data) {
  console.log("001");
  
    const fabricComboPromises = [];
    let fabricCombo = savedFabrics.map(async (fab, i) =>
     await merchantRepository.saveComboFabric(data,
        fab.idFabric,
        fab.placement,
        idProduct,
        fab.consumption,
        fab.idCountryDestination,
        fab.entryDate,
        fab.warehouseEntryDate,
        fab.shippingDate,
        fab.idShipping,
        fab.colors,
        fab.prints,
        data.sizeCurveType,
        data.quantity,
        fab.idStatus
      )
    );



    Promise.all(fabricComboPromises)
  .then((results) => {
    const insertedIdsWithData = results.map((comboFabricReturns) => ({
      insertedId: comboFabricReturns.id, // Replace 'id' with the correct property name for the inserted ID
      data: comboFabricReturns.data, // Replace 'data' with the correct property name for the data
    }));

    // 'insertedIdsWithData' will be an array of objects containing the inserted ID and data for each 'fab' object.
    console.log(insertedIdsWithData);
  })
  .catch((error) => {
    // Handle errors if any of the promises fail.
    console.error('Error:', error);
  });
        //  Promise.all(fabricCombo).then(async (results) => {
          


        //   //TODO: COMENTE ESTO
        //   // let aviosCombo = data.avios.map(async (av) =>
        //   //  await merchantRepository.saveComboAvio(
        //   //     av.idAvio,
        //   //     idCountryDestination,
        //   //     idProduct,
        //   //     entryDate,
        //   //     warehouseEntryDate,
        //   //     shippingDate,
        //   //     idShipping,
        //   //     av.quantity,
        //   //     av.idStatus,
        //   //     av.colors));

        //   // Promise.all(aviosCombo)
        //   //   .then((results) => {
        //   //     console.log("todo bien guardando combo avios")
        //   //     return true;
        //   //   })
        //   //   .catch((err) => {
        //   //     console.log(err)
        //   //     data.result = false;
        //   //     throw new Error("Error - Algo salio mal al guardar los avios");
        //   //   });
        // });
}

async function getProduct(idProduct) {
  try {
    const result = await merchantRepository.getProduct(idProduct);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("Error - El producto enviado no existe.");
    }
  } catch (error) {
    throw error;
  }
}

async function validateIdRise(idTipology) {
  try {
    const result = await merchantRepository.getTipology(idTipology);
    console.log("Buscando tipology")
    console.log(result[0].NAME);
    if (result.length > 0) {
      if(result[0].NAME !== "Jean"){
        console.log(result[0].NAME)
        throw new Error("Error - No puede ingresar un tiro cuando la tipología no es jean.");
      }
      return result;
    } else {
      throw new Error("Error - El producto enviado no existe.");
    }
  } catch (error) {
    throw error;
  }
}

async function saveProduct(data, prodNumber) {
  try {
    const result = await merchantRepository.saveProduct(data, prodNumber);
    if (result > 0) {
      return result;
    } else {
      throw new Error("Error - Algo salio mal al guardar el producto");
    }
  } catch (error) {
    throw error;
  }
}

async function savePictures(data, idProduct) {
  console.log("guardando pics desde datasheet")
  const promises = [];
  var count = 0;
  data.pictures.forEach(async (element) => {
    count++;
    promises.push(
      await merchantRepository.savePicture(
        element.pic,
        idProduct,
        element.isMain,
        count
      )
    );
  });

  return Promise.all(promises);
}

async function saveFabrics(data) {
  let fabrics = [];
  try {
    let promises = [];
    for (let i = 0; i < data.telas.length; i++) {
      let element = data.telas[i];
      if(element.idFabric > 0){ //Tela existente
        var fabric = await merchantRepository.getFabricFromId(element.idFabric, data.idMerchant);
        if(fabric.length > 0){//Encontre la tela
                fabrics.push({
                  idFabric: element.idFabric,
                  placement: element.placement,
                  idColor: element.idColor,
                  idPrint: element.idPrint,
                  printDescription: element.printDescription,
                  colorCount: element.colorCount,
                  consumption: element.consumption,
                  colors: element.colors,
                  prints: element.prints,
                  idCountryDestination: element.idCountryDestination,
                  entryDate: element.entryDate,
                  warehouseEntryDate: element.warehouseEntryDate,
                  shippingDate: element.shippingDate,
                  idShipping: element.idShipping,
                  sizeCurve: element.sizeCurve,
                  idStatus: element.idStatus,
                  quantity: element.quantity
                })
        }else{
          data.result = false;
          throw Error("El id de la tela ingresado no se encuentra en el sistema.");
        }
      }else{
        console.log("la teka no existe")
        promises.push(
          merchantRepository.saveNewFabricInternal(data.idMerchant, element)
          .then(result => {
            console.log("grrr")
            console.log(result)
            if (result > 0) {
              fabrics.push({
                idFabric: result,
                placement: element.placement,
                idColor: element.idColor,
                idPrint: element.idPrint,
                printDescription: element.printDescription,
                colorCount: element.colorCount,
                consumption: element.consumption,
                colors: element.colors,
                prints: element.prints,
                idCountryDestination: element.idCountryDestination,
                entryDate: element.entryDate,
                warehouseEntryDate: element.warehouseEntryDate,
                shippingDate: element.shippingDate,
                idShipping: element.idShipping,
                sizeCurve: element.sizeCurve,
                idStatus: element.idStatus,
                quantity: element.quantity
              });
            }
          })
          .catch(err => {
            data.result = false;
            console.error(err);
          })
        );
      }
    }
    await Promise.all(promises);
    return fabrics;

  } catch (err) {
    data.result = false;
    throw err;
  }
}

async function saveSizeCurve(sizeCurve, idSizeCurveType) {
  console.log("hola")
  let result;
  try {
    if(idSizeCurveType === sizeCurveEnum.shoe){
      console.log("que");
       result = await merchantRepository.saveSizeCurveShoes(sizeCurve);
    }else if(idSizeCurveType === sizeCurveEnum.clothes){
      result = await merchantRepository.saveSizeCurveClothes(sizeCurve);
    }else{
      result = await merchantRepository.saveSizeCurveDenim(sizeCurve);
    }
    if (result > 0) {
      return result;
    } else {
      throw new Error("Error - Error procesando la curva de talle.");
    }
  } catch (error) {
    throw error;
  }
}

async function findDesigner(idDesigner, idMerchant) {
  try {
    const result = await merchantRepository.findDesigner(
      idDesigner,
      idMerchant
    );
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("Error - El disenador ingresado no existe en el sistema");
    }
  } catch (error) {
    throw error;
  }
}

async function findCollection(idCollection, idMerchant) {
  try {
    const result = await merchantRepository.findCollection(
      idCollection,
      idMerchant
    );
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("Error - La colección ingresada no existe.");
    }
  } catch (error) {
    throw error;
  }
}

async function findStatus(idModeling) {
  try {
    const result = await merchantRepository.findStatus(idModeling);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error(
        "Error - El status ingresado para el modelado no existe."
      );
    }
  } catch (error) {
    throw error;
  }
}

async function findTIPOLOGY(idTypology) {
  try {
    const result = await merchantRepository.findTIPOLOGY(idTypology);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("La tipología ingresada no existe en el sistema.");
    }
  } catch (error) {
    throw error;
  }
}

async function findCountry(idCountry) {
  try {
    const result = await merchantRepository.findCountry(idCountry);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("Error - El pais ingresado no existe.");
    }
  } catch (error) {
    throw error;
  }
}

async function findShippingType(idShippingType) {
  try {
    let shipping = idShippingType === " " ? 3 : idShippingType;
    const result = await merchantRepository.findShippingType(shipping);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("El tipo de embarque ingresado no existe en el sistema.");
    }
  } catch (error) {
    throw error;
  }
}
//IdOrigin e IdDestination
//idCountryDestination
function validateData(data) {
  console.log("test quantity");
  console.log(data.quantity);
  validateMerchantBrand(data.idMerchantBrand);
  // validateShippingDate(data.entryDate);
  // validateShippingDate(data.warehouseEntryDate);
  validateName(data.name);

  validateQuantity(data.quantity);
  validateDetail(data.detail);
  // validateIdShipping(data.idShipping);
  validateIdCountry(data.idCountry);
  validateSizeCurveType(data.sizeCurveType);
  // validateIdCountry(data.idCountryDestination);
  validateIdTipology(data.idTipology);
  //validateSizeTable(data.sizeCurve);
  validateIdDesigner(data.idDesigner);
  validateCosts(data.cost, data.costInStore);
  validateComboData(data);
  validateIdIndustry(data.idIndustry);
  //validateYear(data.year);
  validateProyecta(data.proyecta);
  validateConcept(data.idConcept);
  validateIdLine(data.idLine);
  validateIdBodyFit(data.idBodyFit);
  validateExtendedSize(data.extendedSize);
  validateIdShoeMateria(data.idShoeMaterial);
  validateSizeCurveData(data);

}
function validateSizeCurveData(data){
  const sizeCurveTypes = Object.values(sizeCurveEnum);
  if(sizeCurveTypes.map(String).includes(data.sizeCurveType)){
    throw new Error("Tipo de curva de talles invalida.");
  }
}
function validateIdShoeMateria(idShoeMaterial){
  if(idShoeMaterial === undefined){
    throw new Error("Debe ingresar un material de zapato (0 en caso de que no tenga).");
  }
}
function validateConcept(idConcept){
  if(idConcept === undefined){
    throw new Error("Debe ingresar un concepto.");
  }else if(idConcept < 1){
    throw new Error("Concepto invalido.");
  }
}
function validateExtendedSize(idExtendedSize){
  if(idExtendedSize === undefined){
    throw new Error("Debe ingresar si es un talle mayor a 22XL.");
  }else if(idExtendedSize !== true && idExtendedSize !== false){
    throw new Error("Extended size invalido.");
  }
}

function validateComboData(data) {
  console.log("que hace");
  validateFabric(data.telas);
  validateFiberComposition(data.telas);
}

function validateFabric(fabric) {
  fabric.forEach((element) => {
    if (element.idFabric == undefined) {
      throw new Error("Todas las telas deben contar con un id.");
    } else if (element.placement == undefined) {
      throw new Error("Tela con disposicion invalida");
    } 
  });
}

function validateYear(year){
  if(year === undefined || year.isNaN){
    throw new Error("Debe ingresar un año.");
  }
  if(year > 99){
    throw new Error("El año debe contener como máximo 2 cifras.");
  }
}

function validateProyecta(proyecta){
  if(proyecta === undefined){
    throw new Error("Debe ingresar si el producto es proyecta.");
  }
  if(proyecta !== true && proyecta !== false){
    throw new Error("Valor proyecta invalido.");
  }
}

function validateIdShipping(idShipping) {
  if (idShipping === undefined) {
    throw new Error("Debe ingresar un id de tipo de embarque.");
  }
}

function validateMerchantBrand(idMerchantBrand){
  if(idMerchantBrand === undefined || idMerchantBrand < 1){
    throw new Error("Marca invalida");
  }
}

function validateIdBodyFit(idBodyFit){
  if(idBodyFit === undefined){
    throw new Error("Debe ingresar un id de body fit");
  }
}

function validateIdDesigner(idShipping) {
  if (idShipping === undefined) {
    throw new Error("Debe ingresar un id de un disenador.");
  }

}

function validateIdLine(idLine){
  if (idLine === undefined) {
    throw new Error("Debe ingresar un id correspondiente a una linea.");
  }
}
function validateIdIndustry(idIndustry) {
  if (idIndustry === undefined) {
    throw new Error("Debe ingresar un id de un rubro.");
  }
}

function validateIdCountry(idCountry) {
  if (idCountry === undefined) {
    throw new Error("Debe ingresar un id de un país.");
  }
}

function validateShippingDate(shippingDate) {
  if (shippingDate === undefined) {
    throw new Error("Debe ingresar una fecha de embarque.");
  } else {
    var currentDate = new Date();
    if (new Date(Date.parse(shippingDate)) < currentDate) {
      throw new Error("La fecha de embarque no puede ser menor al día de hoy.");
    }
  }
  return shippingDate;
}
function validateSizeCurveType(sizeCurveType) {
  if (sizeCurveType === undefined) {
    throw new Error("Debe ingresar un tipo de curva de talles.");
  } 
  
  return sizeCurveType;
}
function validateIdCareLabel(idCareLabel) {
  if (idCareLabel === undefined) {
    throw new Error("Debe ingresar un id de la etiqueta de cuidados.");
  }
  return idCareLabel;
}
//todo validar lenght size CUrve
function validateIdSizeCurve(idSizeCurve) {
  if (idSizeCurve === undefined) {
    throw new Error("Debe ingresar un id de la tabla de la curva de talles.");
  }else{
    //if sizecurve type es demin length tal
  }
  return idSizeCurve;
}

function validateIdTipology(idTipology) {
  if (idTipology === undefined) {
    throw new Error("Debe ingresar un id de la tipología.");
  }
}

function validateDetail(detail) {

  if (detail === undefined || detail.length <= 500) {
      return detail;
    } else {
      throw new Error(
        "El detalle del producto debe tener al menos 3 caracteres."
      );
    }
  }

function validateWeight(weight) {
  if (weight === undefined) {
    throw new Error("Debe ingresar un peso para el producto.");
  } else {
    if (isNaN(weight)) {
      throw new Error("El peso del producto debe ser numerico.");
    } else {
      if (weight < 1 || weight > 3000) {
        throw new Error(
          "El peso del producto no puede ser menor a 1 gramo ni mayor a 3 kg."
        );
      }
    }
    return weight;
  }
}
function validateQuantity(dataQuantity) {
  console.log("validating quantity");
  console.log(dataQuantity);
  try{
    if (dataQuantity === undefined) {
      throw new Error("Debe ingresar una cantidad para el producto.");
    } else {
      if (isNaN(dataQuantity)) {
        throw new Error("La cantidad del producto debe ser numerico.");
      } else {
        if (dataQuantity < 1 || dataQuantity > 1000000) {
          throw new Error(
            "La cantidad del producto debe ser mayor 0 y menor a 1000000."
          );
        }
      }
      return dataQuantity;
    }
  }catch(exception){
    console.log("Error quantity");
    console.log(exception);
  }

}
function validateName(name) {
  if (name === undefined) {
    throw new Error("Debe ingresar un nombre para el producto.");
  } else {
    if (name.length <= 50) {
      return name;
    } else {
      throw new Error(
        "El nombre del producto debe tener un largo menor a 50 caracteres."
      );
    }
  }
}

// function validateSizeTable(sizeCurve) {
//   var error = sizeCurve.find((x) => x < 0 || x > 10000);
//   if (error !== undefined) {
//     throw new Error("Debe ingresar una tabla de medidas.");
//   }
// }

function validateFiberComposition(fabrics) {
  fabrics.forEach((element) => {
    if (element.idFabric === 0 && element.composition.length < 1) {
      throw new Error("Debe ingresar al menos una fibra");
    } else if (element.description === undefined) {
      throw new Error("Debe ingresar una descripción");
    } else if (element.weight === undefined || element.weighta < 1) {
      throw new Error(
        "Debe ingresar el peso de la tela y el mismo debe ser mayor a 0"
      );
    }  else {
      if(element.idFabric === 0){
        console.log("Musica");
        let sum = 0;
        if(element.composition.length > 0){
          element.composition.forEach((element) => {
            if (element.idFiber === undefined || element.percentage === undefined) {
              throw new Error("Debe ingresar el id y el porcentaje de la fibra");
            } else {
              sum += parseInt(element.percentage);
            }
          });
          if (sum !== 100) {
            throw new Error(
              "La sumatoria de los porcentajes de las fibras debe ser 100."
            );
          }
        }
      }
    }
  });
}

function validateCosts(cost, costInStore) {
  if (cost !== undefined || costInStore !== undefined) {
    if (cost < 1 || costInStore < 1) {
      throw new Error("los costos deben ser mayores a 1");
    }

  }

}

