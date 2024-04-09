import { CouponI } from "../../interfaces/coupon.interface";
import { ProductI } from "../../interfaces/product.interface";
import { CouponM } from "../../models/product/coupon/coupon.model";
import ProductM from "../../models/product/product.model";
import { VerifyCouponProps, VerifyCouponRes } from "./types";

async function VerifyCoupon({
  code,
  ids,
  cart_products,
}: VerifyCouponProps): Promise<VerifyCouponRes> {
  if (ids.length === 0) {
    return {
      data: {
        msg: "Empty cart",
        status: 401,
      },
    };
  }

  const products: ProductI[] = (await ProductM.findAll({
    where: { id: ids },
    attributes: ["id", "category", "brand", "price"],
  })) as ProductI[];

  const { totalPrice, totalQuantity } = cart_products.reduce(
    (acc, { id, quantity }) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        return {
          totalPrice: product.price * quantity + acc.totalPrice,
          totalQuantity: quantity + acc.totalQuantity,
        };
      }
      return acc;
    },
    { totalPrice: 0, totalQuantity: 0 }
  );

  if (!code) {
    return {
      data: {
        msg: "Without coupon",
        status: 200,
        withoutDiscount: totalPrice,
      },
    };
  }

  const coupon: CouponI | null = (await CouponM.findOne({
    where: { code },
  })) as CouponI | null;

  if (!coupon) {
    return {
      data: {
        msg: "Enter a valid coupon!",
        status: 401,
      },
    };
  }

  const currentDate = new Date();

  if (coupon.start_date && coupon.end_date) {
    const start_date = new Date(coupon.start_date);
    const end_date = new Date(coupon.end_date); 

    if (start_date <= currentDate && end_date >= currentDate) {
      
      if (coupon.valid_brand !== null || coupon.valid_category !== null) {
        const valid = products.every((item) => {
          const categoryValid =
            !coupon.valid_category || item.category === coupon.valid_category;
          const brandValid =
            !coupon.valid_brand || item.brand === coupon.valid_brand;
          return categoryValid && brandValid;
        });

        if (!valid) {
          return {
            data: {
              msg: "Some products are not valid for this code!",
              status: 401,
            },
          };
        }
      }

      const disc = (totalPrice * coupon.discount_percentage) / 100;
      const value = totalPrice - disc;
      return {
        data: {
          msg: "Coupon applied!",
          status: 200,
          discount_percentage: coupon.discount_percentage,
          code: coupon.code,
          category: coupon.valid_category,
          brand: coupon.valid_brand,
          description: coupon.description,
          discount: +disc.toFixed(2),
          withoutDiscount: +totalPrice.toFixed(2),
          withDiscount: +value.toFixed(2),
        },
      };
    } else if (start_date > currentDate) {
      return {
        data: {
          msg: "The coupon is not yet valid!",
          status: 401,
        },
      };
    } else if (end_date < currentDate) {
      return {
        data: {
          msg: "The coupon has expired!",
          status: 401,
        },
      };
    }
  }

  return {
    data: {
      msg: "Invalid coupon!",
      status: 401,
    },
  };
}

export { VerifyCoupon };
