import {
  isValidEmail,
  isValidUserId,
} from "../../../service/user/user.service";
import { HtmlRecoveryPassword } from "../../../constants/html";
import { MailerHTML } from "../../mailer/email.utils";

interface SendEmailWithCodePromise {
  status: number;
  msg: string;
}

async function SendEmailWithCode(
  email: string,
  change: string,
  code: string,
  id_existing:number,
  user_id: number
): Promise<SendEmailWithCodePromise> {
  try {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!regex.test(email)) {
      return {
        msg: "Format email invalid.",
        status: 401,
      };
    }

    const existingEmail = await isValidEmail({ email });

    if (existingEmail && id_existing !== existingEmail.user_id) {
      return {
        msg: "Email is already in use.",
        status: 401,
      };
    }

    let html: any;

    if (change === "password") {
      html = HtmlRecoveryPassword(code);
    }

    if (change === "email") {
      html = `<div>Code is: ${code}</div>`
    }

    const success = await MailerHTML({ email, html });

    if (!success) {
      return {
        msg: "Error sending the code to your email.",
        status: 500,
      };
    }
    return {
      msg: "A code has been sent to your email.",
      status: 201,
    };
  } catch (error: any) {
    return {
      msg: error.message || "Internal Error",
      status: error.status || 500,
    };
  }
}
export { SendEmailWithCode };
