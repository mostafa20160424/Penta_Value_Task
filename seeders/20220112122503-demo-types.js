'use strict';

module.exports = {
  up:  (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('note_types', [{
      name: 'congrats',
      disable: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'invitations',
      disable: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('note_types', null, {});

  }
};
