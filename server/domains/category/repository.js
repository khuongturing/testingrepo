import { Category as CategoryModel } from 'src/domains/models';
import baseRepository from 'src/domains/baseRepository';

const categoryRepository = {
  init() {
    this.domain = 'category';
  },

  async getAllCategories({ requestURL, paginationMeta }) {
    const responseData = await baseRepository.getCollectionData({
      domain: this.domain,
      requestURL,
      paginationMeta,
      fetchFromDB: () => CategoryModel.getAllCategoriesAndCount({ paginationMeta })
    });
    return responseData;
  },

  async getProductCategories({ requestURL, productId, throwProductNotFound }) {
    const responseData = await baseRepository.getCollectionData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => CategoryModel.getProductCategories({ productId, throwProductNotFound })
    });
    return responseData;
  },

  async getDepartmentCategories({
    requestURL,
    departmentId,
    throwDepartmentNotFound,
  }) {
    const responseData = await baseRepository.getCollectionData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => CategoryModel.getDepartmentCategories({
        departmentId,
        throwDepartmentNotFound
      }),
    });
    return responseData;
  },

  async getSingleCategory({ requestURL, categoryId }) {
    const responseData = await baseRepository.getItemData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => CategoryModel.findByPk(categoryId)
    });
    return responseData;
  },
};

categoryRepository.init();

export default categoryRepository;
