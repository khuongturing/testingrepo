

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('department', [
    { department_id: 1, name: 'Regional', description: 'no description' },
    { department_id: 2, name: 'Nature', description: 'no description' },
    { department_id: 3, name: 'Seasonal', description: 'no description' }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('department', null, {})
};
