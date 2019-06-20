import { Department as DepartmentModel } from 'src/domains/models';
import baseRepository from 'src/domains/baseRepository';

const departmentRepository = {
  init() {
    this.domain = 'department';
  },

  async getAllDepartments({ requestURL, paginationMeta }) {
    const responseData = await baseRepository.getCollectionData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => DepartmentModel.getAllDepartments({ paginationMeta })
    });
    return responseData;
  },

  async getSingleDepartment({ requestURL, departmentId }) {
    const responseData = await baseRepository.getItemData({
      domain: this.domain,
      requestURL,
      fetchFromDB: () => DepartmentModel.findByPk(departmentId)
    });
    return responseData;
  },
};

departmentRepository.init();

export default departmentRepository;
