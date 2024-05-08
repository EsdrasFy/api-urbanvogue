"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      google_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      facebook_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      github_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      verify_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      profile_img: {
        type: Sequelize.STRING,
      },
      password_hash: {
        type: Sequelize.STRING,
      },
      date_of_birth: {
        type: Sequelize.DATE,
      },
      phone: {
        type: Sequelize.STRING,
      },
      verify_phone: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      gender: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: "Client",
      },
      cpf: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
