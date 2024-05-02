"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentM = void 0;
const index_1 = __importDefault(require("../index"));
const sequelize_1 = require("sequelize");
const user_model_1 = require("../user/user.model");
const payment_pix_model_1 = require("./payment-pix/payment-pix.model");
const product_order_model_1 = require("./product-order/product-order.model");
const payment_card_model_1 = require("./payment-card/payment-card.model");
const PaymentM = index_1.default.define("Payment", {
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    payment_method: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    street: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    cep: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "pending",
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
    },
}, {
    timestamps: false,
    tableName: "payment",
});
exports.PaymentM = PaymentM;
PaymentM.hasMany(user_model_1.UserM, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
user_model_1.UserM.belongsTo(PaymentM, {
    foreignKey: "user_id",
});
PaymentM.hasMany(payment_pix_model_1.PaymentPixM, {
    foreignKey: "order_id",
    as: "payment_pix",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
payment_pix_model_1.PaymentPixM.belongsTo(PaymentM, {
    foreignKey: "order_id",
});
PaymentM.hasMany(payment_card_model_1.PaymentCardM, {
    foreignKey: "order_id",
    as: "payment_card",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
payment_card_model_1.PaymentCardM.belongsTo(PaymentM, {
    foreignKey: "order_id",
});
PaymentM.hasMany(product_order_model_1.ProductOrderM, {
    foreignKey: "order_id",
    as: "product_orders",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product_order_model_1.ProductOrderM.belongsTo(PaymentM, {
    foreignKey: "order_id",
});
