import {
  ShoppingCart as ShoppingCartModel,
} from 'src/domains/models';

const shoppingCartRepository = {
  init() {
    this.domain = 'shoppingCart';
  },

  async addProducToCart({ data, cartId }) {
    const foundProduct = await ShoppingCartModel.findProductInCart(data);
    if (!foundProduct) {
      await ShoppingCartModel.createCartItem(data);
    }
    const rows = await ShoppingCartModel.findCartItems({ cartId });
    return rows;
  },

  async getCartProducts({ cartId, scope }) {
    const rows = await ShoppingCartModel.findCartItems({ cartId, scope });
    return rows;
  },
};

shoppingCartRepository.init();

export default shoppingCartRepository;
