import db from "../../index";
import { DataTypes } from "sequelize";

const PaymentPixM = db.define(
  "PaymentPix",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    payment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    issuer_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notification_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ticket_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transaction_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount:{
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    coupon:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    freight_type:{
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    freight_amount:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_approved: {
      type: DataTypes.DATE,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_expiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "payment_pix",
  }
);

export { PaymentPixM };
