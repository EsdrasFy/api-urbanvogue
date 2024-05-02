"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserM = void 0;
const index_1 = __importDefault(require("../index"));
const sequelize_1 = require("sequelize");
const user_adress_model_1 = require("./user-address/user-adress.model");
const user_card_model_1 = require("./user-card/user-card.model");
const user_role_model_1 = require("./user-role/user-role.model");
const comment_model_1 = require("../product/product-comment/comment.model");
const UserM = index_1.default.define("User", {
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    google_id: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    facebook_id: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    github_id: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    fullname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    verify_email: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    profile_img: {
        type: sequelize_1.DataTypes.STRING,
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING,
    },
    date_of_birth: {
        type: sequelize_1.DataTypes.DATE,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
    },
    verify_phone: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: "users",
});
exports.UserM = UserM;
UserM.hasMany(user_adress_model_1.AddressM, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
user_adress_model_1.AddressM.belongsTo(UserM, {
    foreignKey: "user_id",
});
UserM.hasMany(user_card_model_1.CardM, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
user_card_model_1.CardM.belongsTo(UserM, {
    foreignKey: "user_id",
});
UserM.hasOne(user_role_model_1.UserRoleM, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
user_role_model_1.UserRoleM.belongsTo(UserM, {
    foreignKey: "user_id",
});
UserM.hasOne(comment_model_1.CommentM, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
comment_model_1.CommentM.belongsTo(UserM, {
    foreignKey: "user_id",
});
