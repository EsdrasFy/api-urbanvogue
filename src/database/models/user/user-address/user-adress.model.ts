import { DataTypes } from "sequelize";
import db from "../../index";

const AddressM = db.define(
  'Address',
  {
    address_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    street:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    number:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cep:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    city:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date
    }
  },
  {
    tableName: 'user_address',
    timestamps: false,
  }
);

export {AddressM};