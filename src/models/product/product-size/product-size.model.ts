import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.config";

const ProductSizeM = sequelize.define(
  'ProductSizes',
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
    underscored: true,
    tableName: 'product_sizes',
    timestamps: false,
  }
);

export {ProductSizeM};