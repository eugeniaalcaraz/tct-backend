var Listing = require('../../DefaultMerchant/Listing/Listing');
var ListingRepository = require('../../DAL/ListingQuerys/Listing');
var MerchantRepository = require('../../DAL/MerchantQuerys/Merchant');
const { resolve } = require('path');
const DefaultMerchant = require('../Merchant/Merchant');
const iconv = require('iconv-lite');

module.exports = class ImpactaListing {
    constructor(){

    }

    //CARGA DE COMBOS
    async getSeasons(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getSeasons(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getSupplierName(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getSupplierName(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getDesigners(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getDesigners(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };
    
    async getAllOrigins(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getAllOrigins(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getShipmentType(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getShipmentType(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getStatus(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getStatus(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };
    
    async getWeight(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getWeight(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getQuality(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getQuality(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getProductsNames(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getProductsNames(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getCountries(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getCountries(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };
    //OBTENGO FOTO DEL PRODUCTO
    async getProductPicture(idMerchant, idProduct){
        return new Promise(function(resolve, reject){
            ListingRepository.getProductPicture(idProduct).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    
    async getShippingTypes(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getShippingTypes(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getDepartments(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getDepartments(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getTipologies(idMerchant){
        return new Promise(function(resolve, reject){
            ListingRepository.getTipologies(idMerchant).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    //LISTADO DE ORDENES
    async getAllProducts(idMerchant, idSeason){
        return new Promise(function(resolve, reject){
            ListingRepository.getAllProducts(idMerchant, idSeason).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };

    async getAllProductsWithFilters(idMerchant,idSeason,idBrand,idManagmentUnit,idIndustry,
                                    idTipology,idConcept,idLine,idBodyFit,entryDate,warehouseEntryDate,
                                    storeDate,idShippingType,idFabric,prodName){
        let res = [];
        return new Promise(function(resolve, reject){
            ListingRepository.getAllProductsWithFilters(idMerchant,idSeason,idBrand,idManagmentUnit,idIndustry,
                idTipology,idConcept,idLine,idBodyFit,entryDate,warehouseEntryDate,storeDate,idShippingType,idFabric,prodName).then(async result => {
                    const promises = result.map(async (item) => {
                        await managePic(item);
                        item.fabricData = await MerchantRepository.getFabricComposition(item.idFabric);
                        item.fabricColors = await MerchantRepository.getFabricColors(item.idComboFabric);     
                      });
              
                      await Promise.all(promises);
                      resolve(result);

            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };


}
async function managePic(item){
    console.log("poocahontas")
    console.log(item);
    if(item.pic !== null){
        item.pic = iconv.decode(item.pic, 'utf-8');
    }
}