import { Op, WhereOptions } from "sequelize";
import { ProductI } from "../../interfaces/product.interface";
import { ProductImageM } from "../../database/models/product/product-image/product-image.model";
import { ProductDetailM } from "../../database/models/product/product-detail/product-detail.model";
import { ProductColorM } from "../../database/models/product/product-color/product-color.model";
import { ProductSizeM } from "../../database/models/product/product-size/product-size.model";
import { ProductFlagM } from "../../database/models/product/product-flag/product-flag.model";
import ProductM from "../../database/models/product/product.model";

interface QueryOptionsI {
  title?: { [Op.like]: string };
  brand?: { [Op.like]: string };
  "$colors.name_color$"?: { [Op.like]: string };
  "$details.detail$"?: { [Op.like]: string };
  "$sizes.size$"?: { [Op.like]: string };
  "$flags.flag$"?: { [Op.like]: string };
}

export interface MakeParameters {
  orderBy: string | null;
  category: string | null;
  brand: string | null;
  min: number | null;
  max: number | null;
  offset: number | null;
  limit: number | null;
  productsIds: ProductI[];
}
export interface MakeParametersPromise {
  order: Array<[string, string]>;
  where: any;
  offsetValue: number;
  limitValue: number;
}

export class SearchProducts {
  constructor() {}

  private makeWhereIds(word: string): WhereOptions<QueryOptionsI> {
    return {
      [Op.or]: [
        { title: { [Op.like]: `%${word}%` } },
        { brand: { [Op.like]: `%${word}%` } },
        { "$colors.name_color$": { [Op.like]: `%${word}%` } },
        { "$details.detail$": { [Op.like]: `%${word}%` } },
        { "$sizes.size$": { [Op.like]: `%${word}%` } },
        { "$flags.flag$": { [Op.like]: `%${word}%` } },
      ],
    };
  }

  async makeParameters(
    data: MakeParameters
  ): Promise<MakeParametersPromise | null> {
    try {
      let order: Array<[string, string]> = [];
      if (typeof data.orderBy === "string") {
        const [field, direction] = data.orderBy.split(":");
        const trimmedField = field.trim();
        const trimmedDirection = direction
          ? direction.trim().toLowerCase()
          : "asc";
        const validDirections = ["asc", "desc"];

        if (validDirections.includes(trimmedDirection)) {
          order.push([trimmedField, trimmedDirection]);
        } else {
          throw new Error("Invalid sort direction. Use 'asc' or 'desc'.");
        }
      }

      const where: any = {};
      if (data.productsIds.length > 0) {
        const productIdsArray = data.productsIds.map(
          (product: any) => product.id
        );
        where.id = productIdsArray;
      }
      if (data.category) where.category = data.category;
      if (data.brand) where.brand = data.brand;
      if (data.min && data.max)
        where.price = { [Op.between]: [data.min, data.max] };

      const offsetValue =
        typeof data.offset === "string" ? parseInt(data.offset, 10) : 0;
      const limitValue =
        typeof data.limit === "string" ? parseInt(data.limit, 10) : 100;

      return { offsetValue, limitValue, where, order };
    } catch (error) {
      return null;
    }
  }

  private async findProductsIds(word: string): Promise<ProductI[] | null> {
    try {
      const productsIds: ProductI[] | null =
        ((await ProductM.findAll({
          where: this.makeWhereIds(word),
          attributes: ["id", "category", "brand"],
          include: [
            { model: ProductImageM, as: "images", attributes: ["url"] },
            { model: ProductColorM, as: "colors", attributes: ["name_color"] },
            { model: ProductDetailM, as: "details", attributes: ["detail"] },
            { model: ProductSizeM, as: "sizes", attributes: ["size"] },
            { model: ProductFlagM, as: "flags", attributes: ["flag"] },
          ],
        })) as ProductI[]) || null;

      return productsIds;
    } catch (error) {
      console.error("Error fetching products:", error);
      return null;
    }
  }

  async getProductsIds(query: string): Promise<ProductI[] | null> {
    const productsIds = await this.findProductsIds(query);
    if (productsIds?.length === 0 && query.includes(" ")) {
      const words = query.split(" ");
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const newProductsIds = await this.findProductsIds(word);
        if (newProductsIds) {
          return newProductsIds;
        }
      }
    }

    return productsIds;
  }

  async getFilters(productsIds: ProductI[]) {
    let categories: { [category: string]: number } = {};
    let brands: { [brand: string]: number } = {};
    let sizes: { [size: string]: number } = {};
    let colors: { [color: string]: number } = {};

    for (let i = 0; i < productsIds.length; i++) {
      if (categories[productsIds[i].category]) {
        categories[productsIds[i].category]++;
      } else {
        categories[productsIds[i].category] = 1;
      }

      if (brands[productsIds[i].brand]) {
        brands[productsIds[i].brand]++;
      } else {
        brands[productsIds[i].brand] = 1;
      }

      for (let j = 0; j < productsIds[i].sizes.length; j++) {
        const size = productsIds[i].sizes[j].size;
        sizes[size] = (sizes[size] || 0) + 1;
      }

      for (let j = 0; j < productsIds[i].colors.length; j++) {
        const color = productsIds[i].colors[j].name_color;
        colors[color] = (colors[color] || 0) + 1;
      }
    }
    const filters = { sizes, colors, categories, brands };

    return filters;
  }
}
