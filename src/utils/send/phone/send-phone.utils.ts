import {
  isValidEmail,
  isValidUserId,
} from "../../../service/user/user.service";
import { HtmlRecoveryPassword } from "../../../constants/html";
import { MailerHTML } from "../../mailer/email.utils";
import { SmsTwilio } from "../../sms/twilio/sms-twilio.utils";

interface SendSmsWithCodePromise {
  status: number;
  msg: string;
}

async function SendSmsWithCode(
  email: string,
  change: string,
  code: string,
  user_id: number
): Promise<SendSmsWithCodePromise> {

 await SmsTwilio()
  return {
    msg: "OK SendSmsWithCode",
    status: 200,
  };
  /*const existingEmail = await isValidEmail({ email });

  if (existingEmail && existingUser.user_id !== existingEmail.user_id) {
    return {
      msg: "Email is already in use.",
      status: 401,
    };
  }*/
}
export { SendSmsWithCode };
