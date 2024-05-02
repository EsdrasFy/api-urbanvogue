"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      quantidy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sold: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      state: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brand: {
        type: Sequelize.STRING,
      },
      guarantee: {
        type: Sequelize.STRING,
      },
      assessment: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      qtd_assessment: {
        type: Sequelize.INTEGER,
      },
      parcelable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      max_installments: {
        type: Sequelize.INTEGER,
      },
      interest_rate: {
        type: Sequelize.DOUBLE,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product");
  },
};
