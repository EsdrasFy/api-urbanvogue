import { CardI } from "../../interfaces/card.interface";
import { CardM } from "../../models/user/card/card.model";
import { VerifyCardResponse } from "./types";

async function VerifyCard({
  user_id,
  card_id,
}: {
  user_id: number;
  card_id: number;
}): Promise<VerifyCardResponse> {
  if (!card_id || !user_id) {
    return {
      data: {
        status: 401,
        msg: "The field card_id and user_id is requires!",
        card: null,
      },
    };
  }
  const card: CardI | null = (await CardM.findOne({
    where: {
      user_id: user_id,
      card_id: card_id,
    },
  })) as CardI | null;
  if (!card) {
    return {
      data: {
        status: 404,
        msg: "Card invalid!",
        card: null,
      },
    };
  }

  const date = new Date();

  let month: number = date.getMonth() + 1;

  if (month < 10) {
    month = parseInt("0" + month.toString());
  }

  const year = date.getFullYear();
  const expiration_year = Number("20" + card.expiration_date.split("/")[1]);
  const expiration_month = +card.expiration_date.split("/")[0];

  if (expiration_month < month || expiration_year < year) {
    return {
      data: {
        status: 401,
        msg: "Expired card!",
        card: null,
      },
    };
  }

  return {
    data: {
      card,
      msg: "Card is valid!",
      status: 200,
    },
  };
}

export { VerifyCard };
