import { DataTypes } from "sequelize";
import db from "../../index";

const UserRoleM = db.define(
  "user_card",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "user_card",
    timestamps: false,
  }
);



export { UserRoleM };
