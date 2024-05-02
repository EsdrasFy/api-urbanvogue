"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comments = exports.createComment = void 0;
const product_model_1 = __importDefault(require("../../../database/models/product/product.model"));
const user_model_1 = require("../../../database/models/user/user.model");
const comment_model_1 = require("../../../database/models/product/product-comment/comment.model");
const comment_url_model_1 = require("../../../database/models/product/product-comment/comment-url.model");
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { comment, urls } = req.body;
        if (comment) {
            const { text_comment, user_id, user_img, product_id, rating, recommend, username, } = comment;
            const requiredFields = {
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
            const existingProduct = yield product_model_1.default.findOne({
                where: { id: product_id },
            });
            if (!existingProduct) {
                throw new Error("Product not found!");
            }
            const existingUser = yield user_model_1.UserM.findOne({
                where: { user_id: user_id },
            });
            if (!existingUser) {
                throw new Error("User not found!");
            }
            try {
                const comment = (yield comment_model_1.CommentM.create({
                    text_comment,
                    user_id,
                    user_img,
                    product_id,
                    username,
                    rating,
                    recommend,
                }));
                if (!comment) {
                    return res.status(500).json({ msg: "Internal Error." });
                }
                if (urls) {
                    for (const url of urls) {
                        yield comment_url_model_1.CommentsUrlM.create({
                            comment_id: comment.comment_id,
                            url: url.url,
                        });
                    }
                }
                return res
                    .status(201)
                    .json({ msg: "Comment created successfully!" });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ error: "Error creating comment!", details: error });
            }
        }
        return res
            .status(400)
            .json({ msg: "The comment object was not sent correctly." });
    });
}
exports.createComment = createComment;
function comments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const existingProduct = yield product_model_1.default.findOne({
            where: {
                id: id,
            },
        });
        if (!existingProduct) {
            res.status(401).json({ msg: "Provide a valid id!" });
            return;
        }
        try {
            const comments = yield comment_model_1.CommentM.findAll({
                where: {
                    product_id: id,
                },
                order: [["timespost", "DESC"]],
                include: [
                    {
                        model: comment_url_model_1.CommentsUrlM,
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
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    });
}
exports.comments = comments;
