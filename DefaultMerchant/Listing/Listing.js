var Listing = require('../../DefaultMerchant/Listing/Listing');
var ListingRepository = require('../../DAL/ListingQuerys/Listing');
const { resolve } = require('path');
const DefaultMerchant = require('../Merchant/Merchant');

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

    async getAllProductsWithFilters(idMerchant, idSeason, idDesigner, idFabric, idDepartment, idSupplier, idTipology, idStatus, ProductName, ProductPrice, ProductWeight, idOrigin, idDestination, idShippingType, shippingDate, productSku){
        return new Promise(function(resolve, reject){
            ListingRepository.getAllProductsWithFilters(idMerchant, idSeason, idDesigner, idFabric, idDepartment, idSupplier, idTipology, idStatus, ProductName, ProductPrice, ProductWeight, idOrigin, idDestination, idShippingType, shippingDate, productSku).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };
}