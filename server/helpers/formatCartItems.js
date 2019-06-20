const formatCartItems = (cartItems) => {
  const formattedCartItems = [];
  let i = 0;
  cartItems.forEach((cartItem) => {
    formattedCartItems[i] = {};
    formattedCartItems[i].item_id = cartItem.dataValues.item_id;
    formattedCartItems[i].name = cartItem.dataValues.Product.dataValues.name;
    formattedCartItems[i].attributes = cartItem.dataValues.attributes;
    formattedCartItems[i].price = cartItem.dataValues.Product.price;
    formattedCartItems[i].quantity = cartItem.dataValues.quantity;
    const subTotal = (cartItem.dataValues.Product.price * cartItem.dataValues.quantity)
        - (cartItem.dataValues.Product.discounted_price * cartItem.dataValues.quantity);
    formattedCartItems[i].subtotal = subTotal.toFixed(2).toString();
    i += 1;
  });
  return formattedCartItems;
};

export default formatCartItems;
