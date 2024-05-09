import { Request, Response } from "express";
import { ProductCouponM } from "../../../database/models/product/product-coupon/coupon.model";
import { CouponI } from "../../../interfaces/coupon.interface";
import { ProductI } from "../../../interfaces/product.interface";
import ProductM from "../../../database/models/product/product.model";

async function createCoupons(req: Request, res: Response) {
  const {
    code,
    description,
    valid_category,
    valid_brand,
    discount_percentage,
    start_date,
    end_date,
  } = req.body;

  if (
    !code ||
    !description ||
    !discount_percentage ||
    !start_date ||
    !end_date
  ) {
    return res.status(401).json({
      msg: "The following fields are required: code, description, discount_percentage, start_date, end_date",
    });
  }

  try {
    const createdCoupon = await ProductCouponM.create({
      code,
      description,
      valid_category,
      valid_brand,
      discount_percentage,
      start_date,
      end_date,
    });
    return res
      .status(201)
      .json({ msg: "Coupon created successfully", coupon: createdCoupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

async function validateCoupon(req: Request, res: Response) {
  const { code, ids } = req.body;

  try {
    
    const coupon: CouponI | null = (await ProductCouponM.findOne({
      where: { code },
    })) as CouponI | null;

    if (!coupon) {
      return res.status(404).json({ msg: "Enter a valid coupon!" });
    }

    const currentDate = new Date();

    const products: ProductI[] = (await ProductM.findAll({
      where: { id: ids },
      attributes: ["id", "category", "brand"],
    })) as ProductI[];

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
            return res
              .status(401)
              .json({ msg: "Some products are not valid for this code!" });
          }
        }

        return res.status(200).json({
          status: 200,
          msg: "Coupon applied!",
          code: coupon.code,
          category: coupon.valid_category,
          brand: coupon.valid_brand,
          description: coupon.description,
          percentage: coupon.discount_percentage,
        });
      } else if (start_date > currentDate) {
        return res.status(401).json({ msg: "The coupon is not yet valid!" });
      } else if (end_date < currentDate) {
        return res.status(401).json({ msg: "The coupon has expired!" });
      }
    }

    return res.status(401).json({ msg: "Invalid coupon!" });
  } catch (error) {

    console.error(error);
    return res.status(500).json({ msg: "Internal Error." });
  }
}

export { createCoupons, validateCoupon };
