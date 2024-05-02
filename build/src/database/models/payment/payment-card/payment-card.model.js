"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCardM = void 0;
const index_1 = __importDefault(require("../../index"));
const sequelize_1 = require("sequelize");
const PaymentCardM = index_1.default.define("PaymentCard", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    payment_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    issuer_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    installments: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    installment_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
    cpf_holder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name_holder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    last_digits: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expiration_month: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    expiration_year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    transaction_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
    },
    coupon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    freight_type: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
    },
    freight_amount: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status_detail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date_approved: {
        type: sequelize_1.DataTypes.DATE,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date_of_expiration: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: "payment_card",
});
exports.PaymentCardM = PaymentCardM;
