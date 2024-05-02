import db from "../index";
import { DataTypes } from "sequelize";
import { UserM } from "../user/user.model";
import { PaymentPixM } from "./payment-pix/payment-pix.model";
import { ProductOrderM } from "./product-order/product-order.model";
import { PaymentCardM } from "./payment-card/payment-card.model";

const PaymentM = db.define(
  "Payment",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
  },
  {
    timestamps: false,
    tableName: "payment",
  }
);

PaymentM.hasMany(UserM, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserM.belongsTo(PaymentM, {
  foreignKey: "user_id",
});

PaymentM.hasMany(PaymentPixM, {
  foreignKey: "order_id",
  as: "payment_pix",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

PaymentPixM.belongsTo(PaymentM, {
  foreignKey: "order_id",
});

PaymentM.hasMany(PaymentCardM, {
  foreignKey: "order_id",
  as: "payment_card",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

PaymentCardM.belongsTo(PaymentM, {
  foreignKey: "order_id",
});

PaymentM.hasMany(ProductOrderM, {
  foreignKey: "order_id",
  as: "product_orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ProductOrderM.belongsTo(PaymentM, {
  foreignKey: "order_id",
});

export { PaymentM };
