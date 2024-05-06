import twilio from "twilio";
import "dotenv/config";

const TwilioSid = process.env.TWILIOID;
const TwilioAuth = process.env.TWILIO_AUTH;
const TwilioPhone = process.env.TWILIO_PHONE;

const client = twilio(TwilioSid, TwilioAuth);

async function SmsTwilio(): Promise<void> {
  try {
    const message = await client.messages.create({
      body: "This is code for verification",
      from: TwilioPhone,
      to: "+5511949163426",
    });

    console.log(message.sid);
  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
  }
}

export { SmsTwilio };
