import sequelize from "../../config/db.config";
import { DataTypes } from "sequelize";
import {AddressM} from "./address/adress.model";
import {CardM} from "./card/card.model";
const UserM = sequelize.define(
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
    verify_email:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    verify_phone:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gender: {
      type: DataTypes.STRING,
    },
    cpf: {
      type: DataTypes.STRING,
      unique:true,
      allowNull:true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: "users",
  }
);


UserM.hasMany(AddressM, {
  foreignKey: 'user_id',
});
AddressM.belongsTo(UserM, {
  foreignKey: 'user_id',
});
UserM.hasMany(CardM, {
  foreignKey: 'user_id',
});
CardM.belongsTo(UserM, {
  foreignKey: 'user_id',
});


export {UserM};
