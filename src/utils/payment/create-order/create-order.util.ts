import { AddressI } from "../../../interfaces/address.interface";
import { UserOrderI } from "../../../interfaces/user-order.interface";
import { PaymentM } from "../../../database/models/payment/payment.model";
import { getAddress } from "../../../service/user/user.service";
import { createOrderProps, createOrderRes } from "./types";

async function createOrder({
  user_id,
  payment_method,
  address_id,
}: createOrderProps): Promise<createOrderRes> {
  if (!user_id) {
    return {
      data: {
        msg: "The field user_id is required",
        status: 401,
        order_id: null,
      },
    };
  }
  if (!address_id) {
    return {
      data: {
        msg: "The field address_id is required",
        status: 401,
        order_id: null,
      },
    };
  }

  const address: AddressI | null = await getAddress({ address_id });

  if (!address) {
    return {
      data: {
        msg: "Dont exists address with ID",
        status: 401,
        order_id: null,
      },
    };
  }

  const createdUserOrder: UserOrderI | null = (await PaymentM.create({
    user_id: user_id,
    payment_method,
    street: address?.street,
    number: address?.number,
    cep: address?.cep,
    status: "pending",
    city: address?.city,
    state: address?.state,
  })) as any;

  if (createdUserOrder) {
    return {
      data: {
        msg: "User order created",
        status: 201,
        order_id: createdUserOrder.order_id,
      },
    };
  } else {
    return {
      data: {
        msg: "An error occurred when creating the order",
        status: 500,
        order_id: null,
      },
    };
  }
}
export { createOrder };
