import sequelize from "../../../config/db.config";
import { DataTypes } from "sequelize";

const PaymentCardM = sequelize.define(
  "PaymentCard",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    installments: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    installment_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    cpf_holder: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_holder: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_digits: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiration_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    coupon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    freight_type: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    freight_amount: {
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
    freezeTableName: true,
    underscored: true,
    tableName: "payment_card",
  }
);

export { PaymentCardM };
