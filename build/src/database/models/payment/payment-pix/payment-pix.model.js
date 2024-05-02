"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentPixM = void 0;
const index_1 = __importDefault(require("../../index"));
const sequelize_1 = require("sequelize");
const PaymentPixM = index_1.default.define("PaymentPix", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    notification_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    qr_code: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    ticket_url: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    transaction_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    coupon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    freight_type: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
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
    tableName: "payment_pix",
});
exports.PaymentPixM = PaymentPixM;
