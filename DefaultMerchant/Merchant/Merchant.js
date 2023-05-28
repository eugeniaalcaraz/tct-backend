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

    getMerchantLines({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchantLines(idMerchant).then(result => {
                resolve(result);
            });
        });
    }

    getMerchantBodyFit({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchantBodyFit(idMerchant).then(result => {
                resolve(result);
            });
        });
    }

    getMerchantRise({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchantRise(idMerchant).then(result => {
                resolve(result);
            });
        });
    }

    getMerchantManagmentUnits({idMerchant}){
        var merchant = new ImpactaMerchant();
        return new Promise(function(resolve, reject){
        merchant.merchantExists({idMerchant}).then(result =>{
            if(result.length > 0){
                MerchantRepository.getMerchantManagmentUnits({idMerchant}).then(result => {
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

    getMerchantIndustries({idMerchant, idManagmentUnit}){
        var merchant = new ImpactaMerchant();
        return new Promise(function(resolve, reject){
        merchant.merchantExists({idMerchant}).then(result =>{
            if(result.length > 0){
                MerchantRepository.getMerchantIndustries({idMerchant, idManagmentUnit}).then(result => {
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

    getTipologies({idMerchant, idIndustry}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getTipologies(idMerchant, idIndustry).then(result => {
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
                console.log(err)
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
    getMerchantShoeMaterials(idMerchant){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchantShoeMaterials(idMerchant).then(result => {
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
          console.log(fabrics);
          let promises = [];
          fabrics.forEach(async element => {
            console.log("Recorriendo cada tela")
            console.log(element);
            promises.push(new Promise(async function(resolve, innerReject){
              var fabricComposition = await MerchantRepository.getFabricComposition(element.ID);
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
            });
        });
    }
    getMerchantSizeCurves(){
        return new Promise(async function(resolve, reject){
            const result = [];
            result.push({ shoes: await MerchantRepository.getMerchantShoesSizeCurve() });
            result.push({ denim: await MerchantRepository.getMerchantDenimSizeCurve() });
            result.push({ clothes: await MerchantRepository.getMerchantClothingSizeCurve()});
            resolve(result);

        });
    }
};
