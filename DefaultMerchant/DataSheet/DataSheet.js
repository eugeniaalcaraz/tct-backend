var ProductDTO = require("./ProductDTO");
var merchantRepository = require("../../DAL/MerchantQuerys/Merchant");
var pako = require('pako');



module.exports = class ImpactaDataSheet {
  constructor() {}

  sayHello() {
    return "Hi from Impacta DataSheet!";
  }
  async saveNewProduct(data) {
    let idSizeCurve;

    try {
      return new Promise(async function (resolve, reject) {
        let idProduct;
        let idSizeCurve;
        if (data.idExistingProduct != 0) {
          idProduct = await getProduct(data.idExistingProduct);
          idProduct = data.idExistingProduct;
          idSizeCurve = data.idSizeCurve;
          try {
            validateComboData(data);
          } catch (exception) {
            reject(exception.toString());
          }
        } else {
          try {
            validateData(data);
            await findCountry(data.idCountry);
            await findShippingType(data.idShipping);

            await findTipology(data.idTipology);
            await findStatus(data.idModeling);
            await findCollection(data.idCollection, data.idMerchant);
            await findDesigner(data.idDesigner, data.idMerchant);

            idSizeCurve = await saveSizeCurve(data.sizeCurve, data.idMerchant);
          } catch (exception) {
            reject(exception.toString());
            return;
          }
        }
        idProduct = await saveProduct(data, idSizeCurve);
        let savedFabrics = await saveFabrics(data);
        let idCombo = await saveCombo(idProduct, data.quantity);
        await savePictures(data, idProduct);
        
        let manageFabrics = savedFabrics.map((fabric) =>
          merchantRepository.saveProductFabric(fabric, idProduct)
        );
        Promise.all(manageFabrics)
          .then(async (results) => {

            await handleFabricCombo(savedFabrics, data, idCombo, idProduct);
          })
          .catch((err) => {
            throw new Error(
              "Error - Algo salio mal al asociar las telas con el producto"
            );
          });
        resolve(true);
      });
    } catch (exception) {
      return new Promise(function (resolve, reject) {
        reject(exception.message);
      });
    }
  }
};

async function handleFabricCombo(savedFabrics, data, idCombo, idProduct) {
  let aviosPr = data.avios.map((avio) =>
    merchantRepository.getAvio(avio.idAvio)
  );
  Promise.all(aviosPr).then(async (results) => {
    let fabricCombo = savedFabrics.map((fab, i) =>
      merchantRepository.saveComboFabric(
        idCombo,
        fab.idFabric,
        fab.idColor,
        fab.idPrint,
        fab.printDescription,
        fab.colorCount,
        fab.placement,
        idProduct,
        1,
        i // Status pendiente
      )
    );
    Promise.all(fabricCombo).then(async (results) => {
      let aviosCombo = data.avios.map((av) =>
        merchantRepository.saveComboAvio(
          idCombo,
          av.idAvio,
          av.idColor,
          idProduct,
          1 //status pendiente
        )
      );
      Promise.all(aviosCombo)
        .then((results) => {
          return true;
        })
        .catch((err) => {

          throw new Error("Error - Algo salio mal al guardar los avios");
        });
    });
  });
}

async function getProduct(idProduct) {
  try {
    const result = await merchantRepository.getProuct(idProduct);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error("Error - El producto enviado no existe.");
    }
  } catch (error) {
    throw error;
  }
}

async function saveCombo(idProduct, quantity) {
  try {
    const result = await merchantRepository.saveComboProduct(
      idProduct,
      quantity
    );
    if (result > 0) {
      return result;
    } else {
      throw new Error("Error - Algo salio mal al guardar el producto");
    }
  } catch (error) {
    throw error;
  }
}

async function saveProduct(data, idSizeCurve) {
  try {
    const result = await merchantRepository.saveProduct(data, idSizeCurve);
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
    for (let i = 0; i < data.fabrics.length; i++) {
      let element = data.fabrics[i];
        if(element.idFabric > 1){ //ya existe
          //checkeo que la tela exista

          var fabric = await merchantRepository.getFabricFromId(element.idFabric, data.idMerchant);
          if(fabric.length > 0){
            promises.push(
              await merchantRepository.saveFiberPercentage(element, element.idFabric)
            );
          }else{
            throw Error("Error al almacenar las telas");
          }
      }else{

        promises.push(
          await merchantRepository.saveNewFabricInternal(data.idMerchant, element)
        );
      }

    }
    let results = await Promise.all(promises);
    results.forEach((result, index) => {
      if (result > 0) {
        fabrics.push({
          idFabric: result,
          placement: data.fabrics[index].placement,
          idColor: data.fabrics[index].idColor,
          idPrint: data.fabrics[index].idPrint,
          printDescription: data.fabrics[index].printDescription,
          colorCount: data.fabrics[index].colorCount,
        });
      }
    });
    return fabrics;
  } catch (err) {
    throw err;
  }
}

async function saveSizeCurve(sizeCurve, idMerchant) {
  try {
    const result = await merchantRepository.saveSizeCurve(
      sizeCurve,
      idMerchant
    );
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

async function findTipology(idTypology) {
  try {
    const result = await merchantRepository.findTipology(idTypology);
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
  validateShippingDate(data.shippingDate);
  validateName(data.name);
  validateQuantity(data.quantity);
  validateDetail(data.detail);
  validateIdMeasurmentTable(data.idMeasurmentTable);
  validateIdShipping(data.idShipping);
  validateIdCountry(data.idCountry);
  validateIdCountry(data.idCountryDestination);
  validateIdTipology(data.idTipology);
  validateIdColection(data.idCollection);
  validateIdModeling(data.idModeling);
  validateSizeTable(data.sizeCurve);
  validateIdDesigner(data.idDesigner);
  validateCosts(data.cost, data.costInStore);
  validateComboData(data);
  validateIdDepartment(data.idDepartment);
}

function validateComboData(data) {
  validateFabric(data.fabrics);
  validateFiberComposition(data.fabrics);
}

function validateFabric(fabric) {
  fabric.forEach((element) => {
    if (element.idFabric == undefined) {
      throw new Error("Todas las telas deben contar con un id.");
    } else if (element.idColor == undefined) {
      throw new Error("Tela con idColor invalida");
    } else if (element.placement == undefined) {
      throw new Error("Tela con disposicion invalida");
    } 
  });
}
function validateIdShipping(idShipping) {
  if (idShipping === undefined) {
    throw new Error("Debe ingresar un id de tipo de embarque.");
  }
}

function validateIdDesigner(idShipping) {
  if (idShipping === undefined) {
    throw new Error("Debe ingresar un id de un disenador.");
  }
}

function validateIdDepartment(idShipping) {
  if (idShipping === undefined) {
    throw new Error("Debe ingresar un id de un departamento.");
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

function validateIdCareLabel(idCareLabel) {
  if (idCareLabel === undefined) {
    throw new Error("Debe ingresar un id de la etiqueta de cuidados.");
  }
  return idCareLabel;
}
function validateIdSizeCurve(idSizeCurve) {
  if (idSizeCurve === undefined) {
    throw new Error("Debe ingresar un id de la tabla de la curva de talles.");
  }
  return idSizeCurve;
}
function validateIdMeasurmentTable(idMeasurmentTable) {
  if (idMeasurmentTable === undefined) {
    throw new Error("Debe ingresar un id de la tabla de medidas.");
  }
  return idMeasurmentTable;
}

function validateIdTipology(idTipology) {
  if (idTipology === undefined) {
    throw new Error("Debe ingresar un id de la tipología.");
  }
}

function validateIdColection(idCollection) {
  if (idCollection === undefined) {
    throw new Error("Debe ingresar un id de la coleccion.");
  }
}
function validateIdModeling(idModeling) {
  if (idModeling === undefined) {
    throw new Error("Debe ingresar un id de modelo.");
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

function validateSizeTable(sizeCurve) {
  var error = sizeCurve.find((x) => x < 0 || x > 10000);
  if (error !== undefined) {
    throw new Error("Debe ingresar una tabla de medidas.");
  }
}

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
  });
}

function validateCosts(cost, costInStore) {
  if (cost !== undefined || costInStore !== undefined) {
    if (cost < 1 || costInStore < 1) {
      throw new Error("los costos deben ser mayores a 1");
    }

  }
}