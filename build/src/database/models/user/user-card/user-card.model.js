"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardM = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../../index"));
const CardM = index_1.default.define("user_card", {
    card_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    card_nickname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    card_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name_holder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cpf_holder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    card_network: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expiration_date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cvv: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },
}, {
    tableName: "user_card",
    timestamps: false,
});
exports.CardM = CardM;
