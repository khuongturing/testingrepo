export default {
  collection(data) {
    data.rows = data.rows.map(row => this.item(row));
    return data;
  },
  item(row) {
    return {
      item_id: row.item_id,
      product_id: row.product_id,
      cart_id: row.cart_id,
      attributes: row.attributes,
      quantity: row.quantity,
      buy_now: row.buy_now,
      added_on: row.added_on,
      image: row.product.image,
      subtotal: row.product.price * row.quantity
    };
  },
};
