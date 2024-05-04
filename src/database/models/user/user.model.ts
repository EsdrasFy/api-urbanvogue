import db from "../index";
import { DataTypes } from "sequelize";
import { AddressM } from "./user-address/user-adress.model";
import { CardM } from "./user-card/user-card.model";
import { UserRoleM } from "./user-role/user-role.model";
import { CommentM } from "../product/product-comment/comment.model";
const UserM = db.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    google_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    facebook_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    github_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    verify_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profile_img: {
      type: DataTypes.STRING,
    },
    password_hash: {
      type: DataTypes.STRING,
    },
    date_of_birth: {
      type: DataTypes.DATE,
    },
    phone: {
      type: DataTypes.STRING,
    },
    verify_phone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gender: {
      type: DataTypes.STRING,
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
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
    timestamps: false,
    freezeTableName: true,
    tableName: "user",
  }
);

UserM.hasMany(AddressM, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
AddressM.belongsTo(UserM, {
  foreignKey: "user_id",
});
UserM.hasMany(CardM, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CardM.belongsTo(UserM, {
  foreignKey: "user_id",
});
UserM.hasOne(UserRoleM, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserRoleM.belongsTo(UserM, {
  foreignKey: "user_id",
});

UserM.hasOne(CommentM, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CommentM.belongsTo(UserM, {
  foreignKey: "user_id",
});

export { UserM };
