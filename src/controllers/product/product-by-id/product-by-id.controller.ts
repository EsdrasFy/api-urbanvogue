import { Request, Response } from "express";
import { CommentM } from "../../../models/product/comment/comment.model";
import { ProductI } from "../../../interfaces/product.interface";
import ProductM from "../../../models/product/product.model";
import { ProductImageM } from "../../../models/product/product-image/product-image.model";
import { ProductColorM } from "../../../models/product/product-color/product-color.model";
import { ProductDetailM } from "../../../models/product/product-detail/product-detail.model";
import { ProductSizeM } from "../../../models/product/product-size/product-size.model";

async function productById(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ msg: "Need id!" });
  }

  const intId = parseInt(id, 10);

  try {
    const comments: any = await CommentM.findAll({
      where: {
        product_id: intId,
      },
      attributes: ["rating", "recommend", "product_id"],
    });

    const product: ProductI | null = (await ProductM.findOne({
      where: {
        id: intId,
      },
      include: [
        {
          model: ProductImageM,
          as: "images",
          attributes: ["url"],
        },
        {
          model: ProductColorM,
          as: "colors",
          attributes: ["name_color"],
        },
        {
          model: ProductDetailM,
          as: "details",
          attributes: ["detail"],
        },
        {
          model: ProductSizeM,
          as: "sizes",
          attributes: ["size"],
        },
      ],
    })) as ProductI | null;

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const productStats = comments.reduce((acc: any, comment: any) => {
      const productId = comment.product_id;

      if (!acc[productId]) {
        acc[productId] = {
          ratings: [],
          recommends: [],
        };
      }

      acc[productId].ratings.push(comment.rating);
      acc[productId].recommends.push(comment.recommend);

      return acc;
    }, {});

    const productId = product.id;
    const { ratings, recommends } = productStats[productId] || {};

    const averageRating =
      ratings && ratings.length > 0
        ? ratings.reduce((a: any, b: any) => a + b) / ratings.length
        : 0;

    const recommendPercentage =
      recommends && recommends.length > 0
        ? (recommends.filter((recommend: boolean) => recommend).length /
            recommends.length) *
          100
        : 0;

    const rating = parseFloat(averageRating.toFixed(2));
    const percentage = parseFloat(recommendPercentage.toFixed(2));

    const productsWithStats = {
      ...product.toJSON(),
      rating: rating !== 0 ? rating : 3,
      quantityRatings: ratings ? ratings.length : 0,
      percentage:
        percentage !== 0 && recommends.length !== 0 ? percentage : 100,
      quantityRecommends: recommends ? recommends.length : 0,
    };
    
    res
      .status(200)
      .json({ product: productsWithStats, status: 200, msg: "Successfull!" });
  } catch (error) {
    console.error("Erro ao obter produto:", error);
    res.status(500).json({ error: "Erro ao obter produto" });
  }
}
async function productByIds(req: Request, res: Response) {
  const { ids } = req.params;
  if (!ids) {
    res.status(404).json({ msg: "Need id!" });
  }
  console.log(ids);

  let intIds: number[] = ids.split("&").map((id) => parseInt(id, 10));
  console.log(intIds);

  try {
    const products: ProductI[] = (await ProductM.findAll({
      where: {
        id: intIds,
      },
      include: [
        {
          model: ProductImageM,
          as: "images",
          attributes: ["url"],
        },
        {
          model: ProductColorM,
          as: "colors",
          attributes: ["name_color"],
        },
        {
          model: ProductSizeM,
          as: "sizes",
          attributes: ["size"],
        },
      ],
    })) as ProductI[];

    res.status(200).json({ status: 200, products, msg: " Successfull!" });
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({ error: "Erro ao obter produtos" });
  }
}

export { productById, productByIds };
