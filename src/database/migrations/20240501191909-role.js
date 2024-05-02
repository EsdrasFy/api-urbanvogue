'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      role_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date
      }
    });

    await queryInterface.bulkInsert("role", [
      {
        role_name: "Client",
      },
      {
        role_name: "Client Vip",
      },
      {
        role_name: "Product Manager",
      },
      {
        role_name: "Order Manager",
      },
      {
        role_name: "Customer Service",
      },
      {
        role_name: "Accounting and Finance",
      },
      {
        role_name: "Admin",
      },
      { 
        role_name: "Owner" 
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role');
  }
};
