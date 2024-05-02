"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentM = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../../index"));
const comment_url_model_1 = require("./comment-url.model");
const CommentM = index_1.default.define("ProductComment", {
    comment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    text_comment: {
        type: sequelize_1.DataTypes.TEXT,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    user_img: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    recommend: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: "product_comment",
    timestamps: false,
});
exports.CommentM = CommentM;
CommentM.hasMany(comment_url_model_1.CommentsUrlM, {
    foreignKey: "comment_id",
    as: "urls",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
comment_url_model_1.CommentsUrlM.belongsTo(CommentM, {
    foreignKey: "comment_id",
});
