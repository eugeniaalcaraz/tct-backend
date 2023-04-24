const app = require('./app');
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Brand? ', function (brand) {
    const te = new app();
    te.setCurrentBrand(brand);
    var dinamicBrand = te.getCurrentBrand();
    dinamicBrand.sayHello();
    dinamicBrand.defaultBehaviour();
    rl.close();
});