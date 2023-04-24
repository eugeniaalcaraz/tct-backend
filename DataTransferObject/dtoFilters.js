// export const getFiltersDTO = (filters) => ({
//     season: filters.season,
//     designer: filters.designer,
//     origin: filters.origin,
//     destination: filters.destination,
//     supplier: filters.supplier,
//     department: filters.department,
//     garmentType: filters.garmentType,

//   });

  module.exports = class filtrosDTO{
    Season;
    Designer;
    Origin;
    Destination;
    Supplier;
    Department;
    GarmentType;

  
    constructor() {
      this.Season = false;
      this.Designer = false;
      this.Origin = false
      this.Destination = false;
      this.Supplier = false;
      this.Department = false;
      this.GarmentType = false;
    }
  }


//   let applyFilters = [
//     filterSeason = false,
//     filterDesigner = false,
//     filterOrigin = false,
//     filterDestination = false,
//     filterSupplier = false,
//     filterDepartment = false,
//     filterGarmentType = false,
//     filterMaterial = false,
//     filterProductName = false,
//     filterSkuCpode = false,
//     filterSize = false,
//     filterShipmentType = false,
//     filterShimentDate = false,
//     filterStatus = false,
//     filterCost = false,
//     filterRetailPrice = false,
//     filterMargin = false,
//     filterWeight = false
// ]
