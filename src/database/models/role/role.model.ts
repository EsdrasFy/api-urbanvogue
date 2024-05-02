import { DataTypes } from "sequelize";
import db from "../index";
import { UserRoleM } from "../user/user-role/user-role.model";

const RoleM = db.define(
  "role",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {
    tableName: "user_card",
    timestamps: false,
  }
);

RoleM.hasMany(UserRoleM, {
  foreignKey: "role_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

UserRoleM.belongsTo(RoleM, {
  foreignKey: "role_id",
});

export { RoleM };
