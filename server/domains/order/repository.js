import {
  ShoppingCart as ShoppingCartModel,
} from 'src/domains/models';

const orderRepository = {
  init() {
    this.domain = 'order';
  },

  async addProducToCart({ data, cartId }) {
    const foundProduct = await ShoppingCartModel.findProductInCart(data);
    if (!foundProduct) {
      await ShoppingCartModel.create(data);
    }
    const rows = await ShoppingCartModel.findCartItems({ cartId });
    return rows;
  },

  async getCartProducts({ cartId, scope }) {
    const rows = await ShoppingCartModel.findCartItems({ cartId, scope });
    return rows;
  },
};

orderRepository.init();

export default orderRepository;
