import sequelize from "../../config/db.config";
import { DataTypes } from "sequelize";
import { UserM } from "../user/user.model";
import { PaymentPixM } from "./payment-pix/payment-pix.model";
import { ProductOrderM } from "./product-order/product-order.model";
import { PaymentCardM } from "./payment-card/payment-card.model";

const PaymentM = sequelize.define(
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
    coupon:{
      type: DataTypes.INTEGER,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: "user_order",
  }
);

PaymentM.hasMany(UserM, {
  foreignKey: "user_id",
});
UserM.belongsTo(PaymentM, {
  foreignKey: "user_id",
});

PaymentM.hasMany(PaymentPixM, {
  foreignKey: "order_id",
  as: "payment_pix",
});

PaymentPixM.belongsTo(PaymentM, {
  foreignKey: "order_id",
});

PaymentM.hasMany(PaymentCardM, {
  foreignKey: "order_id",
  as: "payment_card",
});

PaymentCardM.belongsTo(PaymentM, {
  foreignKey: "order_id",
});

PaymentM.hasMany(ProductOrderM, {
  foreignKey: "order_id",
  as: "product_orders",
});

ProductOrderM.belongsTo(PaymentM, {
  foreignKey: "order_id",
});

export { PaymentM };
