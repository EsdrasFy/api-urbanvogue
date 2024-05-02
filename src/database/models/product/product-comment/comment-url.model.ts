import { DataTypes } from "sequelize";
import db from "../../index";

const CommentsUrlM = db.define(
  "ProductCommentUrl",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "product_comment_url",
    timestamps: false,
  }
);

export { CommentsUrlM };
