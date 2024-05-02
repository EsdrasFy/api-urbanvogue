import { DataTypes } from "sequelize";
import db from "../../index";

const ProductSizeM = db.define(
  'ProductSize',
  {
    size_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id:{
      type: DataTypes.INTEGER
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_size',
    timestamps: false,
  }
);

export {ProductSizeM};