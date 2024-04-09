import { Request, Response } from "express";
import ProductM from "../../../models/product/product.model";

interface RequiredFields {
    [key: string]: { null: string; type: string };
  }

async function createProduct(req: Request, res: Response) {
  const {
    title,
    summary,
    quantidy,
    sold,
    price,
    state,
    category,
    sizes,
    brand,
    guarantee,
    variation,
    assessment,
    parcelable,
    max_installments,
    interest_rate,
    cor_id,
    promotion,
    classe,
    images,
} = req.body;

const requiredFields: RequiredFields = {
    title: {
      null: "The field title is required!",
      type: "string",
    },
    summary: {
      null: "The field summary is required!",
      type: "string",
    },
    quantidy: {
      null: "The field quantidy is required!",
      type: "number",
    },
    price: {
      null: "The field price is required!",
      type: "number",
    },
    category: {
      null: "The field category is required!",
      type: "string",
    },
  };

  for (let field in requiredFields) {
    if (!req.body[field]) {
      return res.status(401).json({ msg: requiredFields[field].null });
    }
    if (typeof req.body[field] !== requiredFields[field].type) {
      return res.status(401).json({
        msg: `The field ${field} must be a ${requiredFields[field].type}!`,
      });
    }
  }

  try {
    const produto = await ProductM.create({
      title,
      summary,
      quantidy,
      sold,
      price,
      state,
      category,
      sizes,
      brand,
      guarantee,
      variation,
      assessment,
      parcelable,
      max_installments,
      interest_rate,
      cor_id,
      promotion,
      classe,
    });
   return res.status(201).json({ product: produto, status: 201 });
  } catch (error) {
    return res.status(500).json({ error: "Error creating product!" });
  }
}

async function updateProduct(req: Request, res: Response) {
  const {
    id,
    title,
    summary,
    quantidy,
    sold,
    price,
    state,
    category,
    sizes,
    brand,
    guarantee,
    variation,
    assessment,
    parcelable,
    max_installments,
    interest_rate,
    cor_id,
    promotion,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ msg: "Product ID not provided." });
    }

    const existingProduct = await ProductM.findOne({
      where: { id: id },
    });

    if (!existingProduct) {
      return res.status(404).json({ msg: "Product not found!" });
    }

    const [updatedRows] = await ProductM.update(
      {
        title,
        summary,
        quantidy,
        sold,
        price,
        state,
        category,
        sizes,
        brand,
        guarantee,
        variation,
        assessment,
        parcelable,
        max_installments,
        interest_rate,
        cor_id,
        promotion,
      },
      {
        where: { id: id },
      }
    );

    if (updatedRows > 0) {
      return res
        .status(200)
        .json({ msg: "Product updated successfully." });
    } else {
      return res.status(500).json({ msg: "Failed to update the product." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "A server error has occurred."});
  }
}

async function deleteProduct(req: Request, res: Response) {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ msg: "ID is required for deletion." });
    }

    const existingProduct = await ProductM.findOne({
      where: {
        id: id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ msg: "Product not found." });
    }

    await ProductM.destroy({
      where: { id: id },
    });

   return res.status(200).json({
      msg: `Product with ID ${id} has been deleted from the database.`,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error when deleting product" });
  }
}
export {
    createProduct,
    updateProduct,
    deleteProduct
}