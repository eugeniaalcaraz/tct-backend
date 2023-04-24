var Approvals = require('../../DefaultMerchant/Approvals/Approvals');
var ApprovalsRepository = require('../../DAL/ApprovalsQuerys/Approvals');
const { resolve } = require('path');
const DefaultMerchant = require('../Merchant/Merchant');

module.exports = class ImpactaListing {
    constructor(){

    }

    async getApprovals(idProduct){

        return new Promise(function(resolve, reject){
            ListingRepository.getApprovals(idProduct).then(result => {
                resolve(result);
            }).catch(err => {
                reject("Error: " + err);
            });
        })
    };
}