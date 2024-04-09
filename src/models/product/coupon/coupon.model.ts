import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.config";

const CouponM = sequelize.define(
  'Coupons',
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
  },
  {
    underscored: true,
    tableName: 'coupons',
    timestamps: false,
  }
);

export {CouponM};