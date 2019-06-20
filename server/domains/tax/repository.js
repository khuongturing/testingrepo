import { Tax as TaxModel } from 'src/domains/models';
import baseRepository from 'src/domains/baseRepository';

const taxRepository = {
  init() {
    this.domain = 'tax';
  },

  async getAllTaxes({ requestURL }) {
    const responseData = await baseRepository.getCollectionData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => TaxModel.getAllTaxes()
    });
    return responseData;
  },

  async getTaxById({ requestURL, taxId }) {
    const responseData = await baseRepository.getItemData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => TaxModel.findByPk(taxId)
    });
    return responseData;
  },
};

taxRepository.init();

export default taxRepository;
