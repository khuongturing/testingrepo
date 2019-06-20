import { Op } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const ShoppingCart = sequelize.define('ShoppingCart', {
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cart_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attributes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buy_now: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    added_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    timestamps: false,
    tableName: 'shopping_cart',
    scopes: {
      byField({ field, value }) {
        return {
          where: {
            [field]: {
              [Op.eq]: value
            }
          }
        };
      },
      savedForLater: {
        where: {
          buy_now: {
            [Op.eq]: false
          }
        },
      }
    }
  });

  /**
   * Initialising the ShoppingCart Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  ShoppingCart.initialise = function (models) {
    // ShoppingCart is a collection of CartItems
    // This could rather be name CartItem
    ShoppingCart.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });

    ShoppingCart.scopeByField = (
      field,
      value
    ) => ShoppingCart.scope({ method: ['byField', { field, value }] });

    /**
     * @param {Object} data - The object of data to be inserted
     * @returns {Object} - created record
     */
    ShoppingCart.createCartItem = async (data) => {
      const newItem = await ShoppingCart.create({
        product_id: data.product_id,
        cart_id: data.cart_id,
        attributes: data.attributes,
        quantity: data.quantity || 1,
        buy_now: true,
      });

      return newItem;
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Object} queryOptions.product_id - the product id
     * @param {Object} queryOptions.cart_id - the cart id
     * @returns {Object} - fetched record
     */
    ShoppingCart.findProductInCart = async ({ product_id, cart_id }) => {
      // check that product is not already added
      const foundProducts = await ShoppingCart.findAll({
        where: {
          product_id: { [Op.eq]: product_id },
          cart_id: { [Op.eq]: cart_id },
        },
        attributes: ['item_id']
      });

      return foundProducts[0];
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.cartId - value of cart id
     * @returns {Number} - total amount calculated for cart
     */
    ShoppingCart.getTotalAmountForCart = async ({ cartId }) => {
      const rows = await ShoppingCart.findCartItems({ cartId });
      let total_amount = 0;

      rows.forEach((item) => {
        total_amount += Number(item.product.price) * item.quantity;
      });
      return total_amount;
    };

    /**
     * @param {Object} queryOptions - The options used for retrieving data
     * @param {Number} queryOptions.cartId - value of cart id
     * @param {String} queryOptions.scope - example: 'savedForLater'
     * @returns {Array} - fetched rows
     */
    ShoppingCart.findCartItems = async ({ cartId, scope }) => {
      let rows;
      if (scope === 'savedForLater') {
        rows = await ShoppingCart.scopeByField('cart_id', cartId).findAll({
          include: {
            model: models.Product,
            as: 'product'
          },
          where: {
            buy_now: { [Op.eq]: false }
          }
        });
      } else {
        rows = await ShoppingCart.scopeByField('cart_id', cartId).findAll({
          include: {
            model: models.Product,
            as: 'product'
          }
        });
      }
      return rows;
    };

    /**
     * @param {Number} cartId - value of card id
     * @returns {Number} - number of rows affected
     */
    ShoppingCart.emptyCart = async (cartId) => {
      const rows_affected = await ShoppingCart.scopeByField('cart_id', cartId).destroy();
      return rows_affected;
    };
  };

  ShoppingCart.removeAttribute('id');
  return ShoppingCart;
};
