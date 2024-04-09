import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.config";

const CommentsUrlM = sequelize.define(
  'CommentsUrls',
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: 'comments_urls',
    timestamps: false,
  }
);

export {CommentsUrlM};