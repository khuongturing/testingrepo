import hashPassword from 'src/utils/hashPassword';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credit_card: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eve_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mob_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'customer',
    hooks: {
      beforeCreate(data) {
        data.password = hashPassword(data.password);
      },
    },
    scopes: {
      byField({ field, value }) {
        return {
          where: {
            [field]: {
              [Op.eq]: value
            }
          }
        };
      }
    }
  });

  /**
   * Initialising the Customer Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Customer.initialise = function (models) {
    Customer.hasOne(models.ShippingRegion, {
      foreignKey: 'shipping_region_id',
      as: 'shipping_region'
    });

    Customer.getByField = (field, value) => Customer.scope({ method: ['byField', { field, value }] }).findOne();

    Customer.hasCorrectPassword = (password, customer) => {
      return bcrypt.compareSync(password, customer.password);
    };

    Customer.getAuthUser = async (customerId) => {
      const result = await Customer.findByPk(customerId);
      return result;
    };

    /**
     * This finds or creates a customer from facebook
     * @param {Object} data - data sent from facebook
     * @returns {SequelizeInstance} - new or existing customer
     */
    Customer.storeFacebookUser = async (data) => {
      let customer = await Customer.getByField('email', data.email);
      if (!customer) {
        customer = await Customer.createCustomer(data);
      }
      return customer;
    };

    /**
     * This creates a customer
     * @param {Object} data - data sent from request
     * @returns {SequelizeInstance} - new customer record
     */
    Customer.createCustomer = async (data) => {
      const newCustomer = await Customer.create({
        name: data.name || '',
        email: data.email || '',
        password: data.password || '',
        credit_card: data.credit_card || '',
        address_1: data.address_1 || '',
        address_2: data.address_2 || '',
        city: data.city || '',
        region: data.region || '',
        postal_code: data.postal_code || '',
        country: data.country || '',
        shipping_region_id: data.shipping_region_id || 0,
        day_phone: data.day_phone || '',
        eve_phone: data.eve_phone || '',
        mob_phone: data.mob_phone || '',
      });
      return newCustomer;
    };

    /**
     * This updates a customer
     * @param {Object} options - the options used to perform the action
     * @param {Number} options.customerId - the id of the customer
     * @param {Object} options.data - data sent from request
     * @returns {SequelizeInstance} - updated customer
     */
    Customer.updateCustomer = async ({ customerId, data }) => {
      const customer = await Customer.findByPk(customerId);

      const updateData = {
        name: data.name || customer.name,
        email: data.email || customer.email,
        credit_card: data.credit_card || customer.credit_card,
        address_1: data.address_1 || customer.address_1,
        address_2: data.address_2 || customer.address_2,
        city: data.city || customer.city,
        region: data.region || customer.region,
        postal_code: data.postal_code || customer.postal_code,
        country: data.country || customer.country,
        shipping_region_id: data.shipping_region_id || 0,
        day_phone: data.day_phone || customer.day_phone,
        eve_phone: data.eve_phone || customer.eve_phone,
        mob_phone: data.mob_phone || customer.mob_phone,
      };

      if (data.password) {
        updateData.password = hashPassword(data.password);
      }

      const newCustomer = await customer.update(updateData);
      return newCustomer;
    };
  };

  Customer.removeAttribute('id');
  return Customer;
};
