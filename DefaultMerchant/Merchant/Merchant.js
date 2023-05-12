var MerchantRepository = require('../../DAL/MerchantQuerys/Merchant');

module.exports = class ImpactaMerchant {
    constructor () {

    }
    merchantExists({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchant({idMerchant}).then(result => {
                resolve(result);
            });
        });
    }

    getMerchantSeason({idMerchant, idSeason}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchantSeason({idMerchant,idSeason}).then(result => {
                resolve(result);
            });
        });
    }


    getMerchantDepartments({idMerchant}){
        var merchant = new ImpactaMerchant();
        return new Promise(function(resolve, reject){
        merchant.merchantExists({idMerchant}).then(result =>{
            if(result.length > 0){
                MerchantRepository.getMerchantDepartments({idMerchant}).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject("Error - Whoops algo salió mal");
                });
            }else{
                reject("Error - El comercio ingresado no existe");
            }
        });
    });
    }

    getMerchantSeasons({idMerchant}){
        var merchant = new ImpactaMerchant();
        return new Promise(function(resolve, reject){
        merchant.merchantExists({idMerchant}).then(result =>{
            if(result.length > 0){
                MerchantRepository.getMerchantSeasons({idMerchant}).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject("Error - Whoops algo salió mal");
                });
            }else{
                reject("Error - El comercio ingresado no existe");
            }
        });
    });
    }

    getMerchantSuppliers({idMerchant}){
        var merchant = new ImpactaMerchant();
        return new Promise(function(resolve, reject){
            merchant.merchantExists({idMerchant}).then(result =>{
            if(result.length > 0){
                MerchantRepository.getMerchantSuppliers({idMerchant}).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject("Error - Whoops algo salió mal");
                });
            }else{
                reject("Error - El comercio ingresado no existe");
            }
        });
    });
    }

    getMerchantDesigners({idMerchant}){
        var merchant = new ImpactaMerchant();
        return new Promise(function(resolve, reject){
            merchant.merchantExists({idMerchant}).then(result =>{
            if(result.length > 0){
                MerchantRepository.getMerchantDesigners({idMerchant}).then(result => {
                    resolve(result);
                }).catch(err => {
                    reject("Error - Whoops algo salió mal");
                });
            }else{
                reject("Error - El comercio ingresado no existe");
            }
        });
    });
    }

    getCountries(){
        return new Promise(function(resolve, reject){
            MerchantRepository.getCountries().then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }

    getTipologies(){
        return new Promise(function(resolve, reject){
            MerchantRepository.getTipologies().then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }

    getFibers(){
        return new Promise(function(resolve, reject){
            MerchantRepository.getFibers().then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }

    getTrims(){
        return new Promise(function(resolve, reject){
            MerchantRepository.getTrims().then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }

    getPlacements(){
        return new Promise(function(resolve, reject){
            MerchantRepository.getPlacements().then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }
    getColors(){
        return new Promise(function(resolve, reject){
            MerchantRepository.getColors().then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }

    getFabrics(idMerchant){
        var result = [];
        return new Promise(async function(resolve, reject){
          let fabrics = await MerchantRepository.getFabrics(idMerchant);
          let promises = [];
          fabrics.forEach(async element => {
            promises.push(new Promise(async function(resolve, innerReject){
              var fabricComposition = await MerchantRepository.getFabricComposition(element.Id);
              result.push({IdFabric: element.Id, Description: element.Description, Weight: element.Weight, Composition: fabricComposition})
              resolve();
            }));
          });
          Promise.all(promises)
          .then(() => {
            resolve(result);
          })
          .catch((err) => {
            throw new Error("Error - Algo salio mal al buscar las telas");
          });
        });

    }

    getShippingTypes(){
        return new Promise(function(resolve, reject){
            MerchantRepository.getShippingTypes().then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }

    merchantExists({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchant({idMerchant}).then(result => {
                resolve(result);
            });
        });
    }

    getMerchantBrands({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchantBrands(idMerchant).then(result => {
                console.log(result)
                resolve(result); 
            })
        })
    }

    getMerchantConcepts({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchantConcepts(idMerchant).then(result => {
                resolve(result); 
            })
        })
    }
};
