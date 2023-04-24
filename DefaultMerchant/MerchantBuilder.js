
const ImpactaDashboard = require('../DefaultMerchant/Dashboard/Dashboard');
const ImpactaListing = require('../DefaultMerchant/Listing/Listing');
const ImpactaApprovals = require('../DefaultMerchant/Approvals/Approvals');
const ImpactaMerchant = require('../DefaultMerchant/Merchant/Merchant');
const ImpactaDataSheet = require('../DefaultMerchant/DataSheet/DataSheet');

const classes = {
    ImpactaDashboard,
    ImpactaMerchant,
    ImpactaDataSheet,
    ImpactaListing,
    ImpactaApprovals,
};

module.exports = class DynamicClass {
    
    constructor (className, opts) {
        return new classes[className](opts);
    }

    MerchantExists(IdMerchant){

    }

    SeasonExists({IdMerchant: IdMerchant, IdSeason: IdSeason}){
    }
};

