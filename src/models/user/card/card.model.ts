import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.config";

const CardM = sequelize.define(
  'user_cards',
  {
    card_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    card_nickname:{
      type: DataTypes.STRING,
      allowNull: true
    },
    card_number:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_holder:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf_holder:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    card_network:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvv: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    underscored: true,
    tableName: 'user_cards',
    timestamps: false,
  }
);

export {CardM};