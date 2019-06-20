

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('shipping', [
    {
      shipping_id: 1, shipping_type: 'Next Day Delivery ($20)', shipping_cost: 20.00, shipping_region_id: 2
    },
    {
      shipping_id: 2, shipping_type: '3-4 Days ($10)', shipping_cost: 10.00, shipping_region_id: 2
    },
    {
      shipping_id: 3, shipping_type: '7 Days ($5)', shipping_cost: 5.00, shipping_region_id: 2
    },
    {
      shipping_id: 4, shipping_type: 'By air (7 days, $25)', shipping_cost: 25.00, shipping_region_id: 3
    },
    {
      shipping_id: 5, shipping_type: 'By sea (28 days, $10)', shipping_cost: 10.00, shipping_region_id: 3
    },
    {
      shipping_id: 6, shipping_type: 'By air (10 days, $35)', shipping_cost: 35.00, shipping_region_id: 4
    },
    {
      shipping_id: 7, shipping_type: 'By sea (28 days, $30)', shipping_cost: 30.00, shipping_region_id: 4
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('shipping', null, {})
};
