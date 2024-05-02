import { DataTypes } from "sequelize";
import db from "../../index";

const ProductCouponM = db.define(
  'ProductCoupon',
  {
    coupons_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    valid_category:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    valid_brand:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount_percentage:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: 'product_coupon',
    timestamps: false,
  }
);

export {ProductCouponM};