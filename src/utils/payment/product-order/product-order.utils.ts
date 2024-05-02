import { ProductCartI } from "../../../interfaces/product-cart.interface";
import { ProductOrderM } from "../../../database/models/payment/product-order/product-order.model";
import { createProductOrderRes } from "./types";

async function createProductOrder({
  order_id,
  user_id,
  products,
}: {
  order_id: number;
  user_id: number;
  products: ProductCartI[];
}): Promise<createProductOrderRes> {
  try {
    if (!order_id) {
      return {
        data: {
          msg: "The field order_id is required",
          status: 401,
        },
      };
    }

    if (!user_id) {
      return {
        data: {
          msg: "The field user_id is required",
          status: 401,
        },
      };
    }
    for (const product of products) {
      await ProductOrderM.create({
        order_id,
        product_id: product.id,
        user_id,
        color: product.color,
        image: product.image,
        price: product.price,
        title: product.title,
        size: product.size,
        quantity: product.quantity,
      });
    }
    return {
      data: {
        msg: "Products added to products orders",
        status: 201,
      },
    };
  } catch (error: any) {
    return {
      data: {
        msg:
          error.message || "An error occurred while creating the product order",
        status: 500,
      },
    };
  }
}
export { createProductOrder };
