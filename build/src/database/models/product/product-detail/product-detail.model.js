"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDetailM = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../../index"));
const ProductDetailM = index_1.default.define('ProductDetail', {
    detail_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    detail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'product_detail',
    timestamps: false,
});
exports.ProductDetailM = ProductDetailM;
