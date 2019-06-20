import { ShippingRegion as ShippingRegionModel } from 'src/domains/models';
import baseRepository from 'src/domains/baseRepository';

const shippingRegionRepository = {
  init() {
    this.domain = 'shippingRegion';
  },

  async getAllShippingRegions({ requestURL }) {
    const responseData = await baseRepository.getCollectionData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => ShippingRegionModel.getAllShippingRegions()
    });
    return responseData;
  },

  async getShippingsForARegion({
    requestURL,
    shippingRegionId,
    throwRegionNotFound
  }) {
    const responseData = await baseRepository.getCollectionData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => ShippingRegionModel.getShippingsForARegion({
        shippingRegionId,
        throwRegionNotFound
      }),
    });
    return responseData;
  },
};

shippingRegionRepository.init();

export default shippingRegionRepository;
