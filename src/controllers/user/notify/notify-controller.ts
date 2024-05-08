import { Request, Response } from "express";
import {
  createNotification,
  getUserIdForRole,
} from "../../../service/user/user.service";
import { UserNotifyM } from "../../../database/models/user/user-notify/user-notify.model";

async function createNotifications(req: Request, res: Response) {
  const { title, message, redirect, roles } = req.body;

  if (
    !title ||
    !message ||
    !redirect ||
    !roles ||
    !Array.isArray(roles) ||
    roles.length === 0
  ) {
    return res.status(401).json({
      msg: "The title, message, redirect fields, and roles array are required to create the notification.",
    });
  }
  try {
    const ids = await getUserIdForRole({ roles });
    if (!ids) {
      return res.status(400).json({
        msg: `No users with roles ${roles.map(
          (role: string) => `${role}`
        )}} were found`,
      });
    }
    for (const user_id of ids) {
      await createNotification({ user_id, message, redirect, title });
    }

    return res.status(201).json({ msg: "Notifications created successfully." });
  } catch (error: any) {
    return res
      .status(error.status || 500)
      .json({ msg: error.message || "Internal Error." });
  }
}

async function getNotifications(req: Request, res: Response) {
  const { id } = req.query;
  if (!id) {
    return res.status(401).json({ msg: "The query id is required." });
  }
  const user_id = typeof id === "string" ? parseInt(id) : id;
  try {
    const notifications = await UserNotifyM.findAll({
      where: {
        user_id: user_id,
      },
    });
    if (notifications.length > 0) {
      return res.status(200).json({ notifications });
    }

    throw new Error("Without notifications");
  } catch (error: any) {
    return res.status(400).json({ msg: error.message || "Internal Error." });
  }
}

async function updateNotifications(req: Request, res: Response) {
  const { ids, action } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(401)
      .json({ msg: "At least one id in the list is required" });
  }
  try {
    if (action === "read") {
      const [affectedRowsCount] = await UserNotifyM.update(
        { read: true },
        {
          where: {
            notify_id: ids,
          },
        }
      );
      if (!affectedRowsCount) {
        return res.status(400).json({ msg: "Notifications not updated." });
      }
      return res.status(200).json({ msg: "Updated notifications." });
    }
    if (action === "noRead") {
      const [affectedRowsCount] = await UserNotifyM.update(
        { read: false },
        {
          where: {
            notify_id: ids,
          },
        }
      );
      if (!affectedRowsCount) {
        return res.status(400).json({ msg: "Notifications not updated." });
      }
      return res.status(200).json({ msg: "Updated notifications." });
    }
    if (action === "delete") {
      await UserNotifyM.destroy({
        where: {
          notify_id: ids,
        },
      });

      return res.status(200).json({ msg: "Updated notifications." });
    }
    return res
      .status(401)
      .json({ msg: "Action must be read, noRead or delete" });
  } catch (error: any) {
    return res
      .status(error.status || 500)
      .json({ msg: error.message || "Internal Error." });
  }
}
export { createNotifications, getNotifications, updateNotifications };
