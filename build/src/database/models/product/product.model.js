"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const sequelize_1 = require("sequelize");
const product_image_model_1 = require("./product-image/product-image.model");
const product_flag_model_1 = require("./product-flag/product-flag.model");
const product_size_model_1 = require("./product-size/product-size.model");
const product_detail_model_1 = require("./product-detail/product-detail.model");
const product_color_model_1 = require("./product-color/product-color.model");
const comment_model_1 = require("./product-comment/comment.model");
const ProductM = index_1.default.define("Product", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    summary: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    quantidy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    sold: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    state: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    brand: {
        type: sequelize_1.DataTypes.STRING,
    },
    guarantee: {
        type: sequelize_1.DataTypes.STRING,
    },
    assessment: {
        type: sequelize_1.DataTypes.DOUBLE,
        defaultValue: 0,
    },
    qtd_assessment: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    parcelable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    max_installments: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    interest_rate: {
        type: sequelize_1.DataTypes.DOUBLE,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: "product",
    timestamps: true,
});
ProductM.hasMany(product_color_model_1.ProductColorM, {
    foreignKey: "product_id",
    as: "colors",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product_color_model_1.ProductColorM.belongsTo(ProductM, {
    foreignKey: "product_id",
    as: "product",
});
ProductM.hasMany(product_image_model_1.ProductImageM, {
    foreignKey: "product_id",
    as: "images",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product_image_model_1.ProductImageM.belongsTo(ProductM, {
    foreignKey: "product_id",
    as: "product",
});
ProductM.hasMany(product_flag_model_1.ProductFlagM, {
    foreignKey: "product_id",
    as: "flags",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product_flag_model_1.ProductFlagM.belongsTo(ProductM, {
    foreignKey: "product_id",
    as: "product",
});
ProductM.hasMany(product_detail_model_1.ProductDetailM, {
    foreignKey: "product_id",
    as: "details",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product_detail_model_1.ProductDetailM.belongsTo(ProductM, {
    foreignKey: "product_id",
    as: "product",
});
ProductM.hasMany(product_size_model_1.ProductSizeM, {
    foreignKey: "product_id",
    as: "sizes",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product_size_model_1.ProductSizeM.belongsTo(ProductM, {
    foreignKey: "product_id",
    as: "product",
});
ProductM.hasMany(comment_model_1.CommentM, {
    foreignKey: "product_id",
    as: "comment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
comment_model_1.CommentM.belongsTo(ProductM, {
    foreignKey: "id",
});
exports.default = ProductM;
