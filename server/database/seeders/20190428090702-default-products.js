

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('product', [
    {
      product_id: 1,
      name: 'Product one',
      description: 'The first good product in the database',
      price: 100.00,
      discounted_price: 10.00,
    },
    {
      product_id: 2,
      name: 'Product two',
      description: 'The second product in the database',
      price: 100.00,
      discounted_price: 10.00,
    },
    {
      product_id: 3,
      name: 'Product three',
      description: 'The third product in the database',
      price: 100.00,
      discounted_price: 10.00,
    },
    {
      product_id: 4,
      name: 'Product four',
      description: 'The fourth product in the database',
      price: 100.00,
      discounted_price: 10.00,
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('product', null, {})
};
