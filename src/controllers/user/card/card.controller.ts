import { Request, Response } from "express";
import { CardM } from "../../../models/user/card/card.model";
import { UserM } from "../../../models/user/user.model";
import { CardI } from "../../../interfaces/card.interface";

interface RequiredFields {
  [key: string]: { null: string; type: string };
}

async function createCard(req: Request, res: Response) {
  const body = req.body;
  const {
    type,
    user_id,
    card_number,
    name_holder,
    cpf_holder,
    card_network,
    expiration_date,
    cvv,
    card_nickname,
  } = body;
  const requiredFields: RequiredFields = {
    type: {
      null: "The field type is required!",
      type: "string",
    },
    user_id: {
      null: "The field user_id is required!",
      type: "number",
    },
    card_number: {
      null: "The field card_number is required!",
      type: "string",
    },
    name_holder: {
      null: "The field name_holder is required!",
      type: "string",
    },
    cpf_holder: {
      null: "The field cpf_holder is required!",
      type: "string",
    },
    card_nickname: {
      null: "The field card_nickname is required!",
      type: "string",
    },
    card_network: {
      null: "The field card_network is required!",
      type: "string",
    },
    expiration_date: {
      null: "The field expiration_date is required!",
      type: "string",
    },
    cvv: {
      null: "The field cvv is required!",
      type: "string",
    }
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
    const user = await UserM.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ msg: "User not exists!" });
    }
    await CardM.create({
      type,
      user_id,
      card_number,
      name_holder,
      cpf_holder,
      card_network,
      expiration_date,
      cvv,
      card_nickname,
    });

    return res.status(201).json({ msg: "Card created!" });
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function readCard(req: Request, res: Response) {
  console.log("chamou");
  
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ msg: "User not exists!" });
  }
  parseInt(id);
  try {
    const cards = (await CardM.findAll({
      where: {
        user_id: id,
      },
      attributes: [
        "card_id",
        "type",
        "card_number",
        "card_nickname",
        "card_network",
      ],
    })) as CardI[];
    for (const card of cards) {
      const newCard = card.card_number.split(" ")[3]
      card.card_number = newCard;
    }
    return res.status(200).json({ cards });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export { createCard, readCard };
