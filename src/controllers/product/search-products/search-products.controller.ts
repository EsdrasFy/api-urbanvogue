import { Request, Response } from "express";
import { Op, WhereOptions } from "sequelize";
import ProductM from "../../../database/models/product/product.model";
import { ProductImageM } from "../../../database/models/product/product-image/product-image.model";
import { ProductColorM } from "../../../database/models/product/product-color/product-color.model";
import { ProductSizeM } from "../../../database/models/product/product-size/product-size.model";
import { ProductI } from "../../../interfaces/product.interface";
import {
  MakeParameters,
  MakeParametersPromise,
  SearchProducts,
} from "../../../utils/search/search.utils";

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
    res.status(500).json({ error: "Erro ao obter produtos" });
  }
}

async function productSearch(req: Request, res: Response) {
  const {
    query: oldQuery,
    orderBy,
    limit,
    offset,
    category,
    brand,
    min,
    max,
  } = req.query;
  const search = new SearchProducts();

  if (!oldQuery || typeof oldQuery !== "string") {
    return res
      .status(401)
      .json({ msg: "Query is mandatory and must be a string." });
  }

  const query = oldQuery.split("-").join(" ") as string;

  try {
    const productsIds = await search.getProductsIds(query);

    if (!productsIds || productsIds?.length === 0) {
      return res.status(404).json({
        msg: `No products found for search: ${query}.`,
      });
    }

    const filters = await search.getFilters(productsIds);
    const data: MakeParameters = {
      brand: brand ? (brand as string) : null,
      category: category ? (category as string) : null,
      limit: limit ? +limit : null,
      max: max ? +max : null,
      min: min ? +min : null,
      offset: offset ? +offset : null,
      orderBy: orderBy ? (orderBy as string) : null,
      productsIds: productsIds,
    };

    const { limitValue, offsetValue, order, where } =
      (await search.makeParameters(data)) as MakeParametersPromise;
      
    const products: ProductI[] = (await ProductM.findAll({
      where,
      offset: offsetValue,
      limit: limitValue,
      order,
      include: [{ model: ProductImageM, as: "images", attributes: ["url"] }],
    })) as ProductI[];

    if (products.length > 0) {
      return res.status(200).json({ filters, products });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

export { productSearch, filterProducts };
