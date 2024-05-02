"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFlagM = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../../index"));
const ProductFlagM = index_1.default.define('ProductFlag', {
    flag_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    flag: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'product_flag',
    timestamps: false,
});
exports.ProductFlagM = ProductFlagM;