import { DataTypes } from "sequelize";
import db from "../../index";
import { CommentsUrlM } from "./comment-url.model";

const CommentM = db.define(
  "ProductComment",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    text_comment: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recommend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "product_comment",
    timestamps: false,
  }
);

CommentM.hasMany(CommentsUrlM, {
  foreignKey: "comment_id",
  as: "urls",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CommentsUrlM.belongsTo(CommentM, {
  foreignKey: "comment_id",
});

export { CommentM };
