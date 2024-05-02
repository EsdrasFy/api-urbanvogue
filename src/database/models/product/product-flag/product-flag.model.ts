import { DataTypes } from "sequelize";
import db from "../../index";

const ProductFlagM = db.define(
  'ProductFlag',
  {
    flag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id:{
      type: DataTypes.INTEGER
    },
    flag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_flag',
    timestamps: false,
  }
);

export {ProductFlagM};