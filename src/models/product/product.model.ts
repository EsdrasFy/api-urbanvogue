import sequelize from "../../config/db.config";
import { DataTypes } from "sequelize";
import {ProductImageM} from "./product-image/product-image.model"
import {ProductFlagM} from "./product-flags/product-flags.model"
import {ProductSizeM} from "./product-size/product-size.model"
import {ProductDetailM} from "./product-detail/product-detail.model"
import {ProductColorM} from "./product-color/product-color.model"

const ProductM = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantidy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sold: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
    },
    guarantee: {
      type: DataTypes.STRING,
    },
    assessment: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    qtd_assessment:{
      type: DataTypes.INTEGER
    },
    parcelable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    max_installments: {
      type: DataTypes.INTEGER,
    },
    interest_rate: {
      type: DataTypes.DOUBLE,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: "product",
  },
  );
 // Definindo a associação Um-para-Muitos entre Product e ProductColor
ProductM.hasMany(ProductColorM, {
  foreignKey: 'product_id',
  as: 'colors'
});
ProductColorM.belongsTo(ProductM, {
  foreignKey: 'product_id',
  as: 'product'
});


ProductM.hasMany(ProductImageM, {
  foreignKey: 'product_id',
  as: 'images'
});
ProductImageM.belongsTo(ProductM, {
  foreignKey: 'product_id',
  as: 'product'
});

ProductM.hasMany(ProductFlagM, {
  foreignKey: 'product_id',
  as: 'flags'
});
ProductFlagM.belongsTo(ProductM, {
  foreignKey: 'product_id',
  as: 'product'
});

ProductM.hasMany(ProductDetailM, {
  foreignKey: 'product_id',
  as: 'details'
});
ProductDetailM.belongsTo(ProductM, {
  foreignKey: 'product_id',
  as: 'product'
});

ProductM.hasMany(ProductSizeM, {
  foreignKey: 'product_id',
  as: 'sizes'
});

ProductSizeM.belongsTo(ProductM, {
  foreignKey: 'product_id',
  as: 'product'
});



export default ProductM;