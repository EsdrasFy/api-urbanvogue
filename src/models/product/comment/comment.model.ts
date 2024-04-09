import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.config";
import ProductM from "../product.model";
import { UserM } from "../../user/user.model";
import { CommentsUrlM } from "./comment-url.model";

const CommentM = sequelize.define(
  "Comment",
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
    timespost: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: "comments",
    timestamps: false,
  }
);

CommentM.belongsTo(ProductM, {
  foreignKey: "id",
});
CommentM.belongsTo(UserM, {
  foreignKey: "user_id",
});

CommentM.hasMany(CommentsUrlM, { foreignKey: "comment_id", as: "urls" });
CommentsUrlM.belongsTo(CommentM, { foreignKey: "comment_id" });

export { CommentM };
