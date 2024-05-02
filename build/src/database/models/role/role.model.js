"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleM = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../index"));
const user_role_model_1 = require("../user/user-role/user-role.model");
const RoleM = index_1.default.define("role", {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    role_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
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
    tableName: "user_card",
    timestamps: false,
});
exports.RoleM = RoleM;
RoleM.hasMany(user_role_model_1.UserRoleM, {
    foreignKey: "role_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
user_role_model_1.UserRoleM.belongsTo(RoleM, {
    foreignKey: "role_id",
});
