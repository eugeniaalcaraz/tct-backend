var Dashboard = require("../../DefaultMerchant/Dashboard/Dashboard");
var DashboardRepository = require("../../DAL/DashboardQuerys/Dashboard");
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
                        PVP: sumCostInStore,
                        Cost: sumCost,
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
                                                    object.ProducsPerSeason
                                                );
                                            },
                                            0
                                        );
                                        var arr = [];
                                        var count = 0;
                                        result.forEach((element) => {
                                            arr[count] = {
                                                Status: element.DESCRIPTION,
                                                Percentage: (
                                                    (element.ProducsPerSeason *
                                                        100) /
                                                    sum
                                                ).toFixed(2),
                                            };
                                            count++;
                                        });
                                        resolve(arr);
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
            console.log("1");
            if (validateDate) {
                merchant.merchantExists({ idMerchant }).then((result) => {
                    console.log("2");
                    if (result.length > 0) {
                        merchant
                            .getMerchantSeason({ idMerchant, idSeason })
                            .then((result) => {
                                console.log("3");
                                if (result.length > 0) {
                                    DashboardRepository.getShippingDates({
                                        idMerchant,
                                        idSeason,
                                        month,
                                        year,
                                    })
                                        .then((result) => {
                                            console.log("4");
                                            resolve(result);
                                        })
                                        .catch((err) => {
                                            reject(
                                                "Error - Whoops algo salió mal"
                                            );
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
            return accumulator + object.ProducsPerSeason;
        }, 0);

        var arr = [];
        var count = 0;
        productsStatus.forEach((element) => {
            arr[count] = {
                Status: element.DESCRIPTION,
                Percentage: (element.ProducsPerSeason * 100) / sum,
            };
            count++;
        });
        resolve(arr);
    });
}
