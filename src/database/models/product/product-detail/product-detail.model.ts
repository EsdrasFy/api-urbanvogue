import { DataTypes } from "sequelize";
import db from "../../index";

const ProductDetailM = db.define(
  'ProductDetail',
  {
    detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id:{
      type: DataTypes.INTEGER
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_detail',
    timestamps: false,
  }
);

export {ProductDetailM};