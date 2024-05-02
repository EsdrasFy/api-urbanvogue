import { UserM } from "../../../database/models/user/user.model";
import { AddressM } from "../../../database/models/user/user-address/user-adress.model";
import { AddressI } from "../../../interfaces/address.interface";
import { Request, Response } from "express";
require("dotenv").config();
import { UserI } from "../../../interfaces/user.interface";

async function createAddress(req: Request, res: Response) {
  const {
    user_id,
    street,
    number,
    cep,
    city,
    state,
    type_address,
    references,
  } = req.body;

  const requiredFields = {
    user_id: {
      null: "The field user_id is required!",
      type: "number",
    },
    street: {
      null: "The field street is required!",
      type: "string",
    },
    number: {
      null: "The field number of house is required!",
      type: "number",
    },
    cep: {
      null: "The field cep is required!",
      type: "string",
    },
    city: {
      null: "The field city is required!",
      type: "string",
    },
    state: {
      null: "The field state is required!",
      type: "string",
    },
    type_address: {
      null: "The field type of address is required!",
      type: "string",
    },
  } as any;

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

  const oldUser = (await UserM.findOne({
    where: { user_id: user_id },
  })) as UserI;
  if (!oldUser) {
    return res.json({ status: "User not exists!" });
  }
  try {
    const address = (await AddressM.create({
      user_id,
      street,
      number,
      cep,
      city,
      state,
      type_address,
      references,
    })) as AddressI;
    res.status(201).json({ status: 201, address });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function updateAddress(req: Request, res: Response) {
  const {
    user_id,
    address_id,
    street,
    number,
    cep,
    city,
    state,
    type_address,
    references,
  } = req.body;

  const requiredFields = {
    user_id: {
      null: "The field user_id is required!",
      type: "number",
    },
    address_id: {
      null: "The field address_id is required!",
      type: "number",
    },
    street: {
      null: "The field street is required!",
      type: "string",
    },
    number: {
      null: "The field number of house is required!",
      type: "number",
    },
    cep: {
      null: "The field cep is required!",
      type: "number",
    },
    city: {
      null: "The field city is required!",
      type: "string",
    },
    state: {
      null: "The field state is required!",
      type: "string",
    },
    type_address: {
      null: "The field type of address is required!",
      type: "string",
    },
  } as any;

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

  const oldUser = (await UserM.findOne({
    where: { user_id: user_id },
  })) as UserI;
  if (!oldUser) {
    return res.json({ status: "User not exists!" });
  }
  const oldAddress = await AddressM.findOne({
    where: { address_id: address_id },
  });
  if (!oldAddress) {
    return res.json({ status: "Address not exists!" });
  }
  try {
    await AddressM.update(
      {
        street,
        number,
        cep,
        city,
        state,
        type_address,
        references,
      },
      {
        where: {
          user_id: user_id,
          address_id: address_id,
        },
      }
    );
    res.status(200).json({ msg: "Updated address!" });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function deleteAddress(req: Request, res: Response) {
  const { user, address } = req.query;

  if (!user) {
    res.status(401).json({ msg: "The field user is required!" });
  }
  if (!address) {
    res.status(401).json({ msg: "The field address is required!" });
  }

  const oldUser = (await UserM.findOne({
    where: { user_id: user },
  })) as UserI;
  if (!oldUser) {
    return res.status(401).json({ msg: "User not exists!" });
  }
  const oldAddress = await AddressM.findOne({
    where: { address_id: address },
  });
  if (!oldAddress) {
    return res.status(401).json({ msg: "Address not exists!" });
  }
  try {
    await AddressM.destroy({
      where: {
        user_id: user,
        address_id: address,
      },
    });
    console.log("Deletado");
    
    res.status(204).json({status: 204})
  } catch (error) {
    res.status(500).json({ msg: error});
  }
}
async function readAddress(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ msg: "The field id is requires!" });
  }

  const oldUser = (await UserM.findOne({
    where: { user_id: id },
  })) as UserI;
  if (!oldUser) {
    return res.json({ status: "User not exists!" });
  }

  try {
    const address = await AddressM.findAll({
      where: {
        user_id: id,
      },
    });
    res.status(200).json({ address, status: 200 });
  } catch (error) {
    res.status(500).json({ error });
  }
}
export { createAddress, updateAddress, deleteAddress, readAddress };
