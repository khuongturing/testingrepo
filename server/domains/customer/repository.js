import { Customer as CustomerModel } from 'src/domains/models';
import baseRepository from 'src/domains/baseRepository';

const customerRepository = {
  init() {
    this.domain = 'customer';
  },

  async createCustomer(data) {
    const newCustomer = await CustomerModel.createCustomer(data);
    // New Data available, Clear Redis Data for the Customer domain
    // to eliminate stale data
    baseRepository.clearRedis(this.domain);
    return newCustomer;
  },

  async getCustomerById(customerId) {
    return CustomerModel.findByPk(customerId);
  },
};

customerRepository.init();

export default customerRepository;
