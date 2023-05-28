async function saveNewProduct(data) {
    return new Promise(async (resolve, reject) => {
      let idProduct;
  
      try {
        idProduct = await handleExistingProduct(data);
      } catch (exception) {
        reject(exception.toString());
      }
  
      try {
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
            throw new Error("Error - Something went wrong when associating fabrics to the product");
          });
      } catch (exception) {
        throw new Error("Error - Something went wrong when saving the product data");
      }
  
      resolve(true);
    });
  }
  
  async function handleExistingProduct(data) {
    let idProduct;
  
    if (data.idExistingProduct != 0) {
      idProduct = await getProduct(data.idExistingProduct);
      idProduct = data.idExistingProduct;
      try {
        validateComboData(data);
      } catch (exception) {
        throw exception;
      }
    } else {
      try {
        validateData(data);
        await findCountry(data.idCountry);
        await findShippingType(data.idShipping);
        await findTIPOLOGY(data.idTIPOLOGY);
        await findStatus(data.idModeling);
        await findCollection(data.idCollection, data.idMerchant);
        await findDesigner(data.idDesigner, data.idMerchant);
        await saveSizeCurve(data.sizeCurve, data.idMerchant);
      } catch (exception) {
        throw exception;
      }
    }
  
    return idProduct;
  }
  
  async function handleFabricCombo(savedFabrics, data, idCombo, idProduct) {
    let aviosPr = data.avios.map((avio) => merchantRepository.getAvio(avio.idAvio));
  
    Promise.all(aviosPr)
      .then(async (results) => {
        let fabricCombo = savedFabrics.map((fab) =>
          merchantRepository.saveComboFabric(
            idCombo,
            fab.idFabric,
            fab.idColor,
            fab.idPrint,
            fab.printDescription,
            fab.colorCount,
            fab.placement,
            idProduct,
            1 // Status pendiente
          )
        );
  
        Promise.all(fabricCombo)
          .then(async (results) => {
  let aviosCombo = data.avios.map((av) => merchantRepository.saveComboAvio( idCombo,
                                                                                        av.idAvio,
                                                                                        av.idColor,
                                                                                        idProduct,
                                                                                        1 //status pendiente
                                                                                      ));
  
  Promise.all(aviosCombo).then((results) => {
    resolve(true);
  }).catch((err) => {
    throw new Error("Error - Algo salio mal al guardar los avios");
  });
}) 
})  
}