import { CardI } from "../../../interfaces/card.interface";

export interface VerifyCardProps {}
export interface VerifyCardResponse {
  data: {
    status: number;
    msg: string | null;
    card: CardI | null;
  };
}
