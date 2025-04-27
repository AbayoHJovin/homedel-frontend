import { provinces } from './provinces';
import { districts } from './districts';

export const LocationService = {
  getProvinces: () => provinces,
  
  getDistricts: (province) => districts[province] || [],
  
  getSectors: async (province, district) => {
    // Dynamically import sector data based on province
    const module = await import(`./sectors/${province.toLowerCase()}.js`);
    return module.default[district] || [];
  },
  
  getCells: async (province, district, sector) => {
    // Dynamically import cell data
    const module = await import(`./cells/${province.toLowerCase()}/${district.toLowerCase()}.js`);
    return module.default[sector] || [];
  },
  
  getVillages: async (province, district, sector, cell) => {
    // Dynamically import village data
    const module = await import(`./villages/${province.toLowerCase()}/${district.toLowerCase()}/${sector.toLowerCase()}.js`);
    return module.default[cell] || [];
  }
}; 