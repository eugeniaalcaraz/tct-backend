const DynamicClass = require('./MerchantBuilder');
var currentBrand; //Como hago esto privado?

module.exports = class app {
  constructor () {  
  }

  setCurrentBrand(brandIdentifier){
    currentBrand = new DynamicClass(brandIdentifier);    
  }

  getCurrentBrand(){
    if(currentBrand === undefined){
        throw Error("Comercio no definido");
    }else{
      return currentBrand;
    }
  }
};

