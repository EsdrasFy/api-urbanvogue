import db from "../index";
import { DataTypes } from "sequelize";
import { ProductImageM } from "./product-image/product-image.model";
import { ProductFlagM } from "./product-flag/product-flag.model";
import { ProductSizeM } from "./product-size/product-size.model";
import { ProductDetailM } from "./product-detail/product-detail.model";
import { ProductColorM } from "./product-color/product-color.model";
import { CommentM } from "./product-comment/comment.model";

const ProductM = db.define(
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
    qtd_assessment: {
      type: DataTypes.INTEGER,
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
    tableName: "product",
    timestamps: true,
  }
);

ProductM.hasMany(ProductColorM, {
  foreignKey: "product_id",
  as: "colors",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ProductColorM.belongsTo(ProductM, {
  foreignKey: "product_id",
  as: "product",
});

ProductM.hasMany(ProductImageM, {
  foreignKey: "product_id",
  as: "images",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ProductImageM.belongsTo(ProductM, {
  foreignKey: "product_id",
  as: "product",
});

ProductM.hasMany(ProductFlagM, {
  foreignKey: "product_id",
  as: "flags",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ProductFlagM.belongsTo(ProductM, {
  foreignKey: "product_id",
  as: "product",
});

ProductM.hasMany(ProductDetailM, {
  foreignKey: "product_id",
  as: "details",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ProductDetailM.belongsTo(ProductM, {
  foreignKey: "product_id",
  as: "product",
});

ProductM.hasMany(ProductSizeM, {
  foreignKey: "product_id",
  as: "sizes",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ProductSizeM.belongsTo(ProductM, {
  foreignKey: "product_id",
  as: "product",
});

ProductM.hasMany(CommentM, {
  foreignKey: "product_id",
  as: "comment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CommentM.belongsTo(ProductM, {
  foreignKey: "id",
});

export default ProductM;
