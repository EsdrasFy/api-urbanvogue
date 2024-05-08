  import { DataTypes } from "sequelize";
  import db from "../../index";
  
  const UserNotifyM = db.define(
    "user_notify",
    {
        notify_id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      redirect: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      }
    },
    {
      tableName: "user_notify",
      timestamps: false,
    }
  );
  
  
  
  export { UserNotifyM };
  