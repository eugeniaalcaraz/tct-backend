var MerchantRepository = require('../../DAL/MerchantQuerys/Merchant');
const iconv = require('iconv-lite');

module.exports = class ImpactaMerchant {
    constructor () {

    }

    async getProduct(productNumber, idSeason, idMerchant) {
        console.log("buenaass")
        try {
          let productData = await MerchantRepository.getProductFromNumber(productNumber, idSeason, idMerchant);
          console.log("banana")
          console.log(productData);
          let productPicture = await MerchantRepository.getProductPicture(productData[0].id);
          try{
            productPicture = await managePic(productPicture);
            productData[0].measurementTable = iconv.decode(productData[0].measurementTable, 'utf-8');
            console.log("measure");
            console.log(productData[0].measurementTable);
          }catch(exception){
            console.log(exception);
          }
          let cmbFab = [];
          let comboFabric = await MerchantRepository.getComboFabric(productData[0].id);
          
          await Promise.all(comboFabric.map(async (comboFab) => {
            let comboColorsPromise = MerchantRepository.getComboFabricColors(comboFab.id);
            let comboPrintsPromise = MerchantRepository.getComboFabricPrints(comboFab.id);
            let composition = MerchantRepository.getFabricComposition(comboFab.idFabric)
            comboFab.comboColors = await comboColorsPromise;
            comboFab.comboPrints = await comboPrintsPromise;
            comboFab.composition = await composition;

            try{
                console.log("BANDERAS");
                console.log(comboFab);
                await Promise.all(comboFab.comboColors.map(async (color) => {
                    let res = await MerchantRepository.getSizeCurve(color.idSizeCurve, productData[0].sizeCurveType);
                    color.sizeCurve = Object.values(res[0]).filter(value => typeof value === 'number');
                }));
    
                  await Promise.all(comboFab.comboPrints.map(async (print) => {
                    let res = await MerchantRepository.getSizeCurve(print.idSizeCurve, productData[0].sizeCurveType);
                    print.sizeCurve = Object.values(res[0]).filter(value => typeof value === 'number');
                }));
            }catch(exception){
                console.log("de sizeCuvre")
                console.log(exception);

            }

        
          }));
          let comboAvio;
          try{
            comboAvio = await MerchantRepository.getComboAvio(productData[0].id);
            await Promise.all(comboAvio.map(async (combAv) => {
              let comboAviosColorsPromise = MerchantRepository.getComboAviosColors(combAv.id);
                
              combAv.colors = await comboAviosColorsPromise;
            }))
          }catch(exception){
            console.log(exception);
          }
          console.log("saliendo")
          return {
            basicInfo : productData,
            productPicture: productPicture,
            fabrics: comboFabric,
            avios: comboAvio
          };

        } catch (err) {
          throw new Error("Error - Something went wrong while getting the product: " + err.message);
        }
      }
      
      


    merchantExists({idMerchant}){
        return new Promise(function(resolve, reject){
            MerchantRepository.getMerchant({idMerchant}).then(result => {
                resolve(result);
            });
        });
    }

    getMerchantSeason({idMerchant, idSeason}){
        console.log("id season: " + idSeason)
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

    getTipologies(idIndustry){
        console.log("buscnado tipology")
        return new Promise(function(resolve, reject){
            MerchantRepository.getTipologiesForIndustry(idIndustry).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error - Whoops algo salió mal");
            });
       });
    }

    getAllTipologies(idIndustry){
        console.log("buscnado tipology")
        return new Promise(function(resolve, reject){
            MerchantRepository.getAllTipologies().then(result => {
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
            });
        });
    }
    getMerchantSizeCurves(){
        return new Promise(async function(resolve, reject){
            const result = [];
            result.push({ Shoes: [ 34,35,36,37,38,39,40] });
            result.push({ Denim: [23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38]});
            result.push({ Clothes: ["U","XXS","XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"]});
            resolve(result);

        });
    }
};
async function managePic(item){
    console.log("aconcagua")
    if(item[0].PATH != undefined){
        // const base64String = Buffer.from(item[0].PATH, 'latin1').toString("base64");
        // return "data:image/png;base64," + base64String;   
        console.log(item[0].PATH instanceof Buffer); // Should output "true"
        stringValue = iconv.decode(item[0].PATH, 'utf-8');
        console.log(stringValue);
        return stringValue;
    }
    else{
        return "";
    }
}