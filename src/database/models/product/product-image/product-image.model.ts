import { DataTypes } from "sequelize";
import db from "../../index";

const ProductImageM = db.define(
  'ProductImage',
  {
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id:{
      type: DataTypes.INTEGER
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_image',
    timestamps: false,
  }
);

export {ProductImageM};