import { Op } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00',
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    shipped_on: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    auth_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tax_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'orders',
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
    },
    hooks: {
      async beforeCreate(order) {
        const foundShipping = await order.getShipping();
        const foundTax = await order.getTax();
        if (!foundShipping) {
          throw new Error('Wrong Shipping ID');
        }
        if (!foundTax) {
          throw new Error('Wrong Tax ID');
        }
      },
    },
  });

  /**
   * Initialising the Order Model
   * adding model associations and class methods
   * @param {Object} models - sequelize moodels
   * @returns {void} void
   */
  Order.initialise = function (models) {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });

    Order.belongsTo(models.Shipping, {
      foreignKey: 'shipping_id',
      as: 'shipping',
    });

    Order.belongsTo(models.Tax, {
      foreignKey: 'tax_id',
      as: 'tax',
    });

    Order.hasMany(models.OrderDetail, {
      foreignKey: 'order_id',
      as: 'order_details'
    });

    Order.belongsToMany(models.Product, {
      foreignKey: 'order_id',
      otherKey: 'product_id',
      as: 'order_products',
      through: 'order_detail',
      timestamps: false,
    });

    Order.createOrder = async (data) => {
      const {
        ShoppingCart: ShoppingCartModel,
        OrderDetail: OrderDetailModel,
      } = models;
      const { cart_id: cartId } = data;
      const totalAmount = await ShoppingCartModel.getTotalAmountForCart({ cartId });
      const cartItems = await ShoppingCartModel.findCartItems({ cartId });

      /**
       * If totalAmount is not returned, then no item exists for the cart.
       * we cannot create the order, thence
       */
      if (!totalAmount) {
        throw new Error('No Item for Cart');
      }

      /**
       * Chain the queries for creating order and emptying the cart
       * within a transaction
       */
      const newOrder = sequelize.transaction(async (dbTransaction) => {
        const createdOrder = await Order.create({
          total_amount: totalAmount,
          created_on: data.created_on,
          status: data.status,
          comments: data.comments || '',
          customer_id: data.customer_id,
          auth_code: data.auth_code || '',
          reference: data.reference || '',
          shipping_id: data.shipping_id,
          tax_id: data.tax_id,
        }, { transaction: dbTransaction });

        const orderDetails = cartItems.map((item) => {
          return {
            order_id: createdOrder.order_id,
            product_id: item.product_id,
            attributes: item.attributes,
            product_name: item.product.name,
            quantity: item.quantity,
            unit_cost: item.product.price
          };
        });

        await OrderDetailModel.bulkCreate(orderDetails, { transaction: dbTransaction });
        await ShoppingCartModel.emptyCart(cartId, { transaction: dbTransaction });
        return createdOrder;
      }); // end of transaction

      return newOrder;
    };

    Order.scopeByField = (
      field,
      value
    ) => Order.scope({ method: ['byField', { field, value }] });

    Order.getCustomerOrders = async ({ customer_id }) => {
      const rows = await Order.scopeByField('customer_id', customer_id).findAll();
      return rows;
    };

    /**
     * Instance method
     * for completing the order
     * @param {SequelizeInstance} order - the order instance
     * @returns {SequelizeInstance} - the updated order instance
     */
    Order.prototype.completeOrder = async (order) => {
      const updatedOrder = await order.update({ status: 1 });
      return updatedOrder;
    };
  };


  Order.removeAttribute('id');
  return Order;
};
