import Sequelize from 'sequelize';
import config from 'src/config/database';
import { NODE_ENV } from 'src/config/constants';

// set default environment to development
const environment = NODE_ENV || 'development';

const sequelizeDatabaseConfig = config[environment];
const { database, username, password } = sequelizeDatabaseConfig;

// setup sequelize to log queries in development environment only
sequelizeDatabaseConfig.logging = NODE_ENV === 'development';

const sequelize = new Sequelize(database, username, password, sequelizeDatabaseConfig);

// import all models from their respective domains
const db = {
  Attribute: sequelize.import('./attribute/model'),
  AttributeValue: sequelize.import('./attributeValue/model'),
  Audit: sequelize.import('./audit/model'),
  Category: sequelize.import('./category/model'),
  Customer: sequelize.import('./customer/model'),
  Department: sequelize.import('./department/model'),
  Order: sequelize.import('./order/model'),
  OrderDetail: sequelize.import('./orderDetail/model'),
  Product: sequelize.import('./product/model'),
  ProductCategory: sequelize.import('./productCategory/model'),
  Review: sequelize.import('./review/model'),
  Shipping: sequelize.import('./shipping/model'),
  ShippingRegion: sequelize.import('./shippingRegion/model'),
  ShoppingCart: sequelize.import('./shoppingCart/model'),
  Tax: sequelize.import('./tax/model'),
};

// initialise all models imported
Object.keys(db).forEach((modelName) => {
  if (db[modelName].initialise) {
    db[modelName].initialise(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
