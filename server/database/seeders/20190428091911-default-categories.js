

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('category', [
    {
      category_id: 1, department_id: 1, name: 'French', description: 'no description'
    },
    {
      category_id: 2, department_id: 2, name: 'Italian', description: 'no description'
    },
    {
      category_id: 3, department_id: 2, name: 'Irish', description: 'no description'
    },
    {
      category_id: 4, department_id: 3, name: 'Animal', description: 'no description'
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('category', null, {})
};
