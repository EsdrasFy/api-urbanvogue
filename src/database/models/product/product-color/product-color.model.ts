import { DataTypes } from "sequelize";
import db from "../../index";

const ProductColorM = db.define(
  'ProductColor',
  {
    color_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id:{
      type: DataTypes.INTEGER
    },
    name_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_color',
    timestamps: false,
  }
);

export {ProductColorM};