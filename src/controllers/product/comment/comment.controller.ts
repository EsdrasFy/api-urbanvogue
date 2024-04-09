import { Request, Response } from "express";
import ProductM from "../../../models/product/product.model";
import { UserM } from "../../../models/user/user.model";
import { CommentM } from "../../../models/product/comment/comment.model";
import { CommentI } from "../../../interfaces/comment.interface";
import { CommentsUrlM } from "../../../models/product/comment/comment-url.model";

interface RequiredFields {
  [key: string]: { null: string; type: string };
}

async function createComment(req: Request, res: Response) {
  const { comment, urls } = req.body;
  if (comment) {
    
    const {
      text_comment,
      user_id,
      user_img,
      product_id,
      rating,
      recommend,
      username,
    } = comment;
    
    const requiredFields: RequiredFields = {
      user_id: {
        null: "It is necessary to have the user identifier!",
        type: "number",
      },
      username: {
        null: "You must have the user's username!",
        type: "string",
      },
      user_img: {
        null: "It is necessary to have the user's profile image!",
        type: "string",
      },
      product_id: {
        null: "You must have the product identifier!",
        type: "number",
      },
      rating: {
        null: "It is necessary to have the product rating!",
        type: "string",
      },
    };

    for (let field in requiredFields) {
      if (!req.body.comment[field]) {
        return res.status(401).json({ msg: requiredFields[field].null });
      }
      if (typeof req.body.comment[field] !== requiredFields[field].type) {
        return res.status(401).json({
          msg: `The field ${field} must be a ${requiredFields[field].type}!`,
        });
      }
    }

    if (recommend === undefined || recommend === null) {
      return res
        .status(400)
        .json({ msg: "You need to have a product recommendation!" });
    }

    const existingProduct = await ProductM.findOne({
      where: { id: product_id },
    });

    if (!existingProduct) {
      throw new Error("Product not found!");
    }
    const existingUser = await UserM.findOne({
      where: { user_id: user_id },
    });

    if (!existingUser) {
      throw new Error("User not found!");
    }
    try {
      const comment = (await CommentM.create({
        text_comment,
        user_id,
        user_img,
        product_id,
        username,
        rating,
        recommend,
      })) as unknown as CommentI;
      if (!comment) {
        return res.status(500).json({ msg: "Internal Error." });
      }

      if (urls) {
        for (const url of urls) {
          await CommentsUrlM.create({
            comment_id: comment.comment_id,
            url: url.url,
          });
        }
      }
      return res
        .status(201)
        .json({ msg: "Comment created successfully!"});
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error creating comment!", details: error });
    }
  }
  return res
    .status(400)
    .json({ msg: "The comment object was not sent correctly." });
}
async function comments(req: Request, res: Response) {
  const id = req.params.id;

  const existingProduct = await ProductM.findOne({
    where: {
      id: id,
    },
  });

  if (!existingProduct) {
    res.status(401).json({ msg: "Provide a valid id!" });
    return;
  }

  try {
    const comments = await CommentM.findAll({
      where: {
        product_id: id,
      },
      order: [["timespost", "DESC"]],
      include: [
        {
          model: CommentsUrlM,
          as: "urls",
          attributes: ["url"],
        },
      ],
      attributes: [
        "comment_id",
        "text_comment",
        "user_id",
        "user_img",
        "product_id",
        "username",
        "rating",
        "recommend",
        "timespost",
      ],
    });
    res.status(200).json({ comments, status: 200 });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error });
  }
}

export {
  createComment,
  comments,
};
