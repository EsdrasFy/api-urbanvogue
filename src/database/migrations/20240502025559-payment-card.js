"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_card", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "payment",
          key: "order_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      payment_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      issuer_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      installments: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      installment_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      cpf_holder: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_holder: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_digits: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiration_month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expiration_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      transaction_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      coupon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      freight_type: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      freight_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_detail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_approved: {
        type: Sequelize.DATE,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_of_expiration: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_created: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payment_card");
  },
};
