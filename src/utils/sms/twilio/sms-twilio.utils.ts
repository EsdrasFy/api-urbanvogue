import twilio from "twilio";
import "dotenv/config"

const TwilioSid = process.env.TWILIOID;
const AuthTwilio = process.env.TWILIO_AUTH;

const client = twilio(TwilioSid, AuthTwilio);

async function SmsTwilio(): Promise<void> {
  try {
    const message = await client.messages.create({
      body: "This is code for verification",
      from: "+12176353724",
      to: "+5511949163426",
    });

    console.log(message.sid);
  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
  }
}

export { SmsTwilio };
