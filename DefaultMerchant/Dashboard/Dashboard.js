var Dashboard = require("../../DefaultMerchant/Dashboard/Dashboard");
var DashboardRepository = require("../../DAL/DashboardQuerys/Dashboard");
var MerchantRepository = require("../../DAL/MerchantQuerys/Merchant");
const { BalanceCategories } = require("./Enums");
var InspectionCategories = require("../Dashboard/Enums");
const { resolve } = require("path");
const DefaultMerchant = require("../Merchant/Merchant");

module.exports = class ImpactaDashboard {
    constructor() {}

    sayHello() {
        return "Hi from Impacta Dashboard!";
    }

    getSeasons({ idMerchant, idDepartment }) {
        var merchant = new DefaultMerchant();
        return new Promise(function (resolve, reject) {
            merchant.merchantExists({ idMerchant }).then((result) => {
                if (result.length > 0) {
                    merchant
                        .getMerchantDepartment({ idMerchant, idDepartment })
                        .then((result) => {
                            if (result.length > 0) {
                                resolve(
                                    DashboardRepository.getSeasons(
                                        idMerchant,
                                        idDepartment
                                    )
                                );
                            } else {
                                reject(
                                    "Error - El comercio ingresado no existe"
                                );
                            }
                        });
                } else {
                    reject("Error - La temporada ingresada no existe");
                }
            });
        });
    }

    async getSKUsAndPieces(idMerchant, idSeason, idCategory) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.getSKUsAndPieces(
                idMerchant,
                idSeason,
                idCategory
            ).then((result) => {
                resolve(result);
            });
        });
    }

    async getAllSKUsAndPieces(idMerchant, idSeason) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.getAllSKUsAndPieces(idMerchant, idSeason).then(
                (result) => {
                    resolve(result);
                }
            );
        });
    }

    async getPendantApprovals(idMerchant, idSeason) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.getPendantApprovals(idMerchant, idSeason).then(
                (result) => {
                    resolve(result);
                }
            );
        });
    }

    async getTopSixProductsWithStatusOnTheWay(idMerchant, idSeason) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.getTopProductsWithStatus(
                idMerchant,
                idSeason,
                2,
                6
            ).then((result) => {
                resolve(result);
            });
        });
    }
    //Calidad
    //Color
    //Avios

    async getBalanceInfo({idMerchant, idSeason}) {
        const aviosAttention = 60;
        const aviosCritical = 50;
        const fabricAttention = 90;
        const fabricInCritical = 80;
        const colorAttention = 60;
        const colorCritical = 50; 
        
        try{
            const aviosData = await DashboardRepository.getAviosStatusForBalance(idMerchant, idSeason);
            const aviosBalance =  await this.balanceLogic(aviosCritical, aviosAttention, aviosData);
            
    
            const fabricData = await DashboardRepository.getFabricStatusForBalance(idMerchant, idSeason);
            const fabricBalance = await this.balanceLogic(fabricInCritical, fabricAttention, fabricData);


            const colorData = await DashboardRepository.getFabricColorStatusForBalance(idMerchant, idSeason);
            const colorBalance = await this.balanceLogic(colorCritical, colorAttention, colorData);

            const sampleData = await DashboardRepository.getSampleStatusForBalance(idMerchant, idSeason);
            const sampleDataAproval = sampleData.filter(x => x.sampleType === 1);
            const sampleDataPreProduction = sampleData.filter(x => x.sampleType === 2);
            const sampleDataProduction = sampleData.filter(x => x.sampleType === 3);

            const sampleDataAprovaleBalance = await this.balanceLogic(90, 100, sampleDataAproval);
            const sampleDataPreProductionBalance = await this.balanceLogic(50, 60, sampleDataPreProduction);
            const sampleDataProductionBalance = await this.balanceLogic(40, 45, sampleDataProduction);

            const sampleCount = sampleData.length;
            const sampleCombinedResult = {
                dataInAttention: (sampleDataAprovaleBalance.dataInAttention + sampleDataPreProductionBalance.dataInAttention + sampleDataProductionBalance.dataInAttention) / sampleCount * 100,
                dataInCritical: (sampleDataAprovaleBalance.dataInCritical + sampleDataPreProductionBalance.dataInCritical + sampleDataProductionBalance.dataInCritical) / sampleCount * 100,
                dataInAllGood: (sampleDataAprovaleBalance.dataInAllGood + sampleDataPreProductionBalance.dataInAllGood + sampleDataProductionBalance.dataInAllGood) / sampleCount * 100
              };
              
            return {
                avioInCritical: aviosBalance.dataInCritical,
                aviosInAttention: aviosBalance.dataInAttention,
                aviosInOk: aviosBalance.dataInAllGood,
                fabricInCritical: fabricBalance.dataInCritical,
                fabricInAttention: fabricBalance.dataInAttention,
                fabricInOk: fabricBalance.dataInAllGood,
                colorInCritical: colorBalance.dataInCritical,
                colorInAttention: colorBalance.dataInAttention,
                colorInOk: colorBalance.dataInAllGood,
                sampleInCritical: sampleCombinedResult.dataInCritical,
                sampleInAttention: sampleCombinedResult.dataInAttention,
                sampleInOk: sampleCombinedResult.dataInAllGood
            }
        }catch(exception){
            
        }

      }

    async balanceLogic(inCritical, inAttention, data){

        const totalAviosCount = data.length;
        const aviosWithPendantStatus = data.filter(x => x.idStatus === 1);
        
        let dataInAttention = 0;
        let dataInCritical = 0;
        
        aviosWithPendantStatus.forEach(avio => {
          const shippingDate = new Date(avio.shippingDate);
          const daysBeforeShipping = Math.ceil((shippingDate - Date.now()) / (1000 * 60 * 60 * 24));
          
          if (daysBeforeShipping < inCritical) {
            dataInCritical++;
          } else if (daysBeforeShipping <= inAttention) {
            dataInAttention++;
          }
        });
        
        const dataInAllGood = totalAviosCount - dataInAttention - dataInCritical;
        
        return {
          dataInAttention,
          dataInCritical,
          dataInAllGood
        };
    }

    


      
    async getMaterialsSummary(idMerchant, idSeason) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.getMaterialsSummary(
                idMerchant,
                idSeason,
            ).then((result) => {
                const totalCount = result.reduce((sum, item) => sum + item['TOTALPERFABRIC'], 0);
                let res = result.map(item => ({
                Description: item.DESCRIPTION,
                Weight: item.WEIGHT,
                Percentage: (item['TOTALPERFABRIC'] / totalCount) * 100
                }));

                resolve(res);
            });
        });
    }

    async SKUandPieces(idMerchant, idSeason) {
        var result = [];
        var pieces = await DashboardRepository.SKUandPieces(idMerchant, idSeason);
        var tipologies = await DashboardRepository.getTipologiesForSKUandPieces(idMerchant, idSeason);
        var idIndustries = tipologies.map(item => item.IdIndustry.toString()).join(',');
        var countCombos = await DashboardRepository.getCountCombosForSKUandPieces(idIndustries, idSeason, idMerchant);
         tipologies = tipologies.map(item => {
            const matchingItem = countCombos.find(
              match => match.IdTipology === item.idTipology && match.IdIndustry === item.IdIndustry
            );
          
            if (matchingItem) {
              return {
                ...item,
                comboColorCount: matchingItem.comboColorCount,
                comboPrintCount: matchingItem.comboPrintCount
              };
            } else {
              return item;
            }
          });
        return new Promise(function (resolve, reject) {
            try{
                pieces.map(x => {
                    const matchingTipologies = tipologies.filter(t => parseInt(t.IdIndustry) === parseInt(x.idIndustry));
                    
                    x.comboColorCount = matchingTipologies.reduce((sum, tipology) => sum + tipology.comboColorCount, 0);
                    x.comboPrintCount = matchingTipologies.reduce((sum, tipology) => sum + tipology.comboPrintCount, 0);
                    x.tipologies = matchingTipologies;

                  });
            }catch(exception){
                
            }

      
          resolve(pieces);
        });
      }
      
    async getPiecesByColor(idMerchant, idSeason) {
        var response = [];
        return new Promise(function (resolve, reject) {
          DashboardRepository.getPiecesByColor(idMerchant, idSeason)
            .then(async (result) => {
              await Promise.all(result.map(async (res) => {
                var sizeCurve = await MerchantRepository.getSizeCurve(res.ID_SIZE_CURVE, res.SIZE_CURVE_TYPE);
                res.totalPieces = sizeCurve[0].total;
                response.push({
                    idColor: res.idColor,
                    colorDescription: res.colorDescription,
                    RGB: res.RGB,
                    totalPieces: res.totalPieces
                })

                
              }));
              resolve(response.reduce((acc, obj) => {
                const existingObj = acc.find(item => item.idColor === obj.idColor);
                if (existingObj) {
                  existingObj.totalPieces += obj.totalPieces;
                } else {
                  acc.push(obj);
                }
                return acc;
              }, [])
              );
            })
            .catch((error) => {
              reject(error);
            });
        });
      }

    async getSeasonMargin(idMerchant, idSeason) {
        return new Promise(function (resolve, reject) {
            DashboardRepository.getDataForMarginCalculations(
                idMerchant,
                idSeason
            ).then((result) => {
                if (result.length > 0) {
                    let sumCostInStore = result[0].sumCostInStore;
                    let sumCost = result[0].sumCost;
                    let res =
                        ((sumCostInStore / 1.22 - sumCost) /
                            (sumCostInStore / 1.22)) *
                        100;
                    resolve({
                        PVP: roundToFive(sumCostInStore),
                        Cost:  roundToNinety(sumCost),
                        Margin: res.toFixed(2),
                    });
                }
                resolve({
                    PVP: 0,
                    Cost: 0,
                    Margin: 0,
                });
            });
        });
    }

    
    async getProductStatusForSeason({ idMerchant, idSeason }) {
        var merchant = new DefaultMerchant();
        return new Promise(function (resolve, reject) {
            merchant.merchantExists({ idMerchant }).then((result) => {
                if (result.length > 0) {
                    merchant
                        .getMerchantSeason({ idMerchant, idSeason })
                        .then((result) => {
                            if (result.length > 0) {
                                DashboardRepository.getProductsStatus({
                                    idMerchant,
                                    idSeason,
                                })
                                    .then((result) => {
                                        
                                        const sum = result.reduce(
                                            (accumulator, object) => {
                                                return (
                                                    accumulator +
                                                    object.PRODUCSPERSEASON
                                                );
                                            },
                                            0
                                        );
                                        var arr = [];
                                        var count = 0;
                                        try{
                                            result.forEach((element) => {
                                            
                                                arr[count] = {
                                                    Status: element.DESCRIPTION,
                                                    Percentage: (
                                                        (element.PRODUCSPERSEASON *
                                                            100) /
                                                        sum
                                                    ).toFixed(2),
                                                };
                                                count++;
                                            });
                                            resolve(arr);
                                        }catch(exception){
                                            console.log("error");
                                            
                                        }

                                 
                                    })
                                    .catch((err) => {
                                        reject("Error - Whoops algo salió mal");
                                    });
                            } else {
                                reject(
                                    "Error - El comercio ingresado no existe"
                                );
                            }
                        });
                } else {
                    reject("Error - La temporada ingresada no existe");
                }
            });
        });
    }
    async getCalendarData({ idMerchant, idSeason, month, year }) {
        var merchant = new DefaultMerchant();
        return new Promise(function (resolve, reject) {
            if (validateDate) {
                merchant.merchantExists({ idMerchant }).then((result) => {
                    if (result.length > 0) {
                        merchant
                            .getMerchantSeason({ idMerchant, idSeason })
                            .then((result) => {                                
                                if (result.length > 0) {
                                    DashboardRepository.getShippingDates({
                                        idMerchant,
                                        idSeason,
                                        month,
                                        year,
                                    })
                                        .then((result) => {
                                            resolve(result);
                                        })
                                        .catch((err) => {
                                            reject(
                                                "Error - Whoops algo salió mal"
                                            );
                                        });
                                } else {
                                    reject(
                                        "Error - La temporada ingresada no existe."
                                    );
                                }
                            });
                    } else {
                        reject("Error - La temporada ingresada no existe");
                    }
                });
            } else {
                return "Error - Mes o año invalido";
            }
        });
    }

    async getBalanceData({ idMerchant, idSeason }) {
        var merchant = new DefaultMerchant();
        return new Promise(function (resolve, reject) {
            merchant.merchantExists({ idMerchant }).then((result) => {
                if (result.length > 0) {
                    merchant
                        .getMerchantSeason({
                            idMerchant: idMerchant,
                            idSeason: idSeason,
                        })
                        .then((result) => {
                            if (result.length > 0) {
                                let balanceConfig;
                                let productResults;
                                DashboardRepository.getBalanceDatesConfig({
                                    idMerchant: idMerchant,
                                })
                                    .then((result) => {
                                        balanceConfig = result;
                                        DashboardRepository.getBalanceData({
                                            idMerchant: idMerchant,
                                            idSeason: idSeason,
                                        })
                                            .then((result) => {
                                                productResults = result;
                                                resolve(
                                                    getResultBalanceData(
                                                        productResults,
                                                        balanceConfig
                                                    )
                                                );
                                            })
                                            .catch((err) => {
                                                
                                                reject(
                                                    "Error - Whoops algo salió mal"
                                                );
                                            });
                                    })
                                    .catch((err) => {
                                        
                                        reject("Error - Whoops algo salió mal");
                                    });
                            } else {
                                reject(
                                    "Error - La temporada ingresada no existe"
                                );
                            }
                        });
                } else {
                    reject("Error - El comercio ingresado no existe");
                }
            });
        });
    }
};

function getResultBalanceData(productResult, balanceConfig) {
    var attentionProducts = 0;
    var criticalProducts = 0;
    var acceptableProducts = 0;
    balanceDateConfig = balanceConfig[0];
    var result;
    return Promise.all(
        productResult.map((element) => {
            return new Promise((resolve, reject) => {
                if (
                    PendantProductInAttentionCategory(
                        element,
                        balanceDateConfig.AttentionDaysConfigForPendant
                    ) ||
                    NotApprovedProductInAttentionCategory(
                        element,
                        balanceDateConfig.AttentionDaysConfigForNotApproved
                    )
                ) {
                    attentionProducts++;
                } else if (
                    NotApprovedProductInCriticalCategory(
                        element,
                        balanceDateConfig.CriticalDaysConfigForNotApproved
                    ) ||
                    PendantProductInCriticalCategory(
                        element,
                        balanceDateConfig.CriticalDaysConfigForPendant
                    )
                ) {
                    criticalProducts++;
                } else {
                    acceptableProducts++;
                }
                resolve(); // add this line to indicate that the promise has completed for this iteration
            });
        })
    )
        .then(() => {
            var data = [
                {
                    Type: BalanceCategories.Acceptable.toString(),
                    Percetage: Math.round(
                        (acceptableProducts * 100) / productResult.length
                    ),
                },
                {
                    Type: BalanceCategories.Attention.toString(),
                    Percetage: Math.round(
                        (attentionProducts * 100) / productResult.length
                    ),
                },
                {
                    Type: BalanceCategories.Critical.toString(),
                    Percetage: Math.round(
                        (criticalProducts * 100) / productResult.length
                    ),
                },
            ];
            return data;
        })
        .catch((error) => {});
}

function PendantProductInAttentionCategory(element, balanceDateConfig) {
    return (
        element.IdInspection === 2 &&
        element.DaysBeforeShipping <= balanceDateConfig
    );
}
function NotApprovedProductInAttentionCategory(element, balanceDateConfig) {
    return (
        element.IdInspection === 3 &&
        element.DaysBeforeShipping <= balanceDateConfig
    );
}
function PendantProductInCriticalCategory(element, balanceDateConfig) {
    return (
        element.IdInspection === 2 &&
        element.DaysBeforeShipping <= balanceDateConfig
    );
}
function NotApprovedProductInCriticalCategory(element, balanceDateConfig) {
    return (
        element.IdInspection === 3 &&
        element.DaysBeforeShipping <= balanceDateConfig
    );
}

function validateDate({ month, year }) {
    return month === undefined || month < 1 || month > 12 || year === undefined;
}

function getStatusPercentages(productsStatus) {
    return new Promise(function (resolve, reject) {
        const sum = productsStatus.reduce((accumulator, object) => {
            return accumulator + object.PRODUCSPERSEASON;
        }, 0);

        var arr = [];
        var count = 0;
        productsStatus.forEach((element) => {
            arr[count] = {
                Status: element.DESCRIPTION,
                Percentage: (element.PRODUCSPERSEASON * 100) / sum,
            };
            count++;
        });
        resolve(arr);
    });
}

function roundToNinety(numero) {
    const residuo = numero % 90;

    // Verifica si el residuo es mayor o igual a la mitad de 90
    if (residuo >= 45) {
      // Redondea hacia arriba al múltiplo de 90 más cercano
      return numero + (90 - residuo);
    } else {
      // Redondea hacia abajo al múltiplo de 90 más cercano
      return numero - residuo;
    }
  }

  function roundToFive(numero) {
    // Calcula el residuo al dividir el número entre 5
    const residuo = numero % 5;
  
    // Verifica si el residuo es mayor o igual a la mitad de 5
    if (residuo >= 2.5) {
      // Redondea hacia arriba al múltiplo de 5 más cercano
      return numero + (5 - residuo);
    } else {
      // Redondea hacia abajo al múltiplo de 5 más cercano
      return numero - residuo;
    }
  }
