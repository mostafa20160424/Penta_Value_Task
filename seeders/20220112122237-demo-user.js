'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      name: 'mostafa',
      picture: 'default.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'khaled',
      picture: 'default.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
