import { Request, Response } from "express";
import { Op, WhereOptions } from "sequelize";
import ProductM from "../../../database/models/product/product.model";
import { ProductImageM } from "../../../database/models/product/product-image/product-image.model";
import { ProductColorM } from "../../../database/models/product/product-color/product-color.model";
import { ProductDetailM } from "../../../database/models/product/product-detail/product-detail.model";
import { ProductSizeM } from "../../../database/models/product/product-size/product-size.model";
import { ProductFlagM } from "../../../database/models/product/product-flag/product-flag.model";
import { ProductI } from "../../../interfaces/product.interface";

async function filterProducts(req: Request, res: Response) {
  const {
    id,
    search,
    categoria,
    brand,
    valor_min,
    valor_max,
    state,
    tamanho,
    avaliacao_min,
    promocao,
    offset,
    order_by,
    limit,
  } = req.query;
  try {
    let where: any = {};
    /////////////////////////////////////// ////////////////////////////////////////////
    if (categoria) {
      where.category = categoria;
    }
    if (brand) {
      where.brand = brand;
    }
    if (state) {
      where.state = state;
    }
    if (id) {
      where.id = id;
    }
    if (avaliacao_min) {
      where.assessment = { [Op.gte]: avaliacao_min };
    }
    if (valor_min && valor_max) {
      where.price = { [Op.between]: [valor_min, valor_max] };
    }
    if (promocao) {
      where.promotion = { [Op.not]: null || false };
    }
    if (typeof tamanho === "string") {
      const tamanhoArray = tamanho.split(",").map((tam) => tam.trim());

      const tamanhoConditions = tamanhoArray.map((tam) => ({
        sizes: { [Op.like]: `%${tam}%` },
      }));

      where[Op.and] = tamanhoConditions;
    }

    let order: Array<[string, string]> = [];
    if (typeof order_by === "string") {
      const [field, direction] = order_by.split(":");
      const trimmedField = field.trim();
      const trimmedDirection = direction
        ? direction.trim().toLowerCase()
        : "asc";
      const validDirections = ["asc", "desc"];

      if (validDirections.includes(trimmedDirection)) {
        order.push([trimmedField, trimmedDirection]);
      } else {
        return res.status(400).json({
          error: "Direção de ordenação inválida. Use 'asc' ou 'desc'.",
        });
      }
    }

    const options: {
      where: WhereOptions<any>;
      offset: number;
      limit: number;
      order: [string, string][];
    } = {
      where,
      offset: typeof offset === "string" ? parseInt(offset, 10) : 0,
      limit: typeof limit === "string" ? parseInt(limit, 10) : 10,
      order: order.length > 0 ? [...order] : [],
    };
    if (typeof search === "string") {
      options.where = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { brand: { [Op.like]: `%${search}%` } },
          { category: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const products = await ProductM.findAll({
      ...options,
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
    });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({ error: "Erro ao obter produtos" });
  }
}

async function productSearch(req: Request, res: Response) {
  const { query, orderBy, limit, offset, category, brand, min, max } =
    req.query;

  try {
    let whereCondition: any = {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { brand: { [Op.like]: `%${query}%` } },
        {
          "$colors.name_color$": { [Op.like]: `%${query}%` },
        },
        {
          "$details.detail$": { [Op.like]: `%${query}%` },
        },
        {
          "$sizes.size$": { [Op.like]: `%${query}%` },
        },
        {
          "$flags.flag$": { [Op.like]: `%${query}%` },
        },
      ],
    };

    const productsId: ProductI[] = (await ProductM.findAll({
      where: whereCondition,
      attributes: ["id", "category", "brand"],
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
        {
          model: ProductFlagM,
          as: "flags",
          attributes: ["flag"],
        },
      ],
    })) as ProductI[];

    let categories: { [category: string]: number } = {};

    for (let i = 0; i < productsId.length; i++) {
      if (categories[productsId[i].category]) {
        categories[productsId[i].category]++;
      } else {
        categories[productsId[i].category] = 1;
      }
    }

    let brands: { [brand: string]: number } = {};

    for (let i = 0; i < productsId.length; i++) {
      if (brands[productsId[i].brand]) {
        brands[productsId[i].brand]++;
      } else {
        brands[productsId[i].brand] = 1;
      }
    }

    let sizes: { [size: string]: number } = {};

    for (let i = 0; i < productsId.length; i++) {
      for (let j = 0; j < productsId[i].sizes.length; j++) {
        const size = productsId[i].sizes[j].size;

        if (sizes[size]) {
          sizes[size]++;
        } else {
          sizes[size] = 1;
        }
      }
    }
    let colors: { [color: string]: number } = {};

    for (let i = 0; i < productsId.length; i++) {
      for (let j = 0; j < productsId[i].colors.length; j++) {
        const color = productsId[i].colors[j].name_color;

        if (colors[color]) {
          colors[color]++;
        } else {
          colors[color] = 1;
        }
      }
    }
    const filters = {
      sizes,
      colors,
      categories,
      brands,
    };

    let order: Array<[string, string]> = [];
    if (typeof orderBy === "string") {
      const [field, direction] = orderBy.split(":");
      const trimmedField = field.trim();
      const trimmedDirection = direction
        ? direction.trim().toLowerCase()
        : "asc";
      const validDirections = ["asc", "desc"];

      if (validDirections.includes(trimmedDirection)) {
        order.push([trimmedField, trimmedDirection]);
      } else {
        return res.status(400).json({
          error: "Direção de ordenação inválida. Use 'asc' ou 'desc'.",
        });
      }
    }

    const productIdsArray = productsId.map((product: any) => product.id);

    let where: any = {};

    if (productIdsArray) {
      where.id = productIdsArray;
    }
    if (category) {
      where.category = category;
    }

    if (brand) {
      where.brand = brand;
    }

    if (min && max) {
      where.price = { [Op.between]: [min, max] };
    }

    const offsetValue = typeof offset === "string" ? parseInt(offset, 10) : 0;
    const limitValue = typeof limit === "string" ? parseInt(limit, 10) : 23;
    const orderValue = order.length > 0 ? [...order] : [];

    const products: ProductI[] = (await ProductM.findAll({
      where: where,
      offset: offsetValue,
      limit: limitValue,
      order: orderValue,
      include: [
        {
          model: ProductImageM,
          as: "images",
          attributes: ["url"],
        },
      ],
    })) as ProductI[];
    if (products.length > 0) {
      return res.status(200).json({ filters, products });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export { productSearch, filterProducts };
