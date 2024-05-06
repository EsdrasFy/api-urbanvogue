import { Client, LocalAuth } from "whatsapp-web.js";
import * as qrcode from "qrcode-terminal";

interface ClientMap {
  [clientId: string]: Client;
}

const clients: ClientMap = {};

interface SendMessageResponse {
  data: {
    status: number;
    msg: string;
  };
}

function startClient(id: string): void {
  clients[id] = new Client({
    authStrategy: new LocalAuth({
      clientId: id,
    }),
    webVersionCache: {
      type: "remote",
      remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2407.3.html`,
    },
  } as any);
  clients[id].on("authenticated", () => console.log("WhatsApp authenticated."));
  clients[id].on("auth_failure", () =>
    console.log("WhatsApp authentication failed.")
  );
  clients[id].on("disconnected", () =>
    console.log("WhatsApp lost connection.")
  );
  clients[id].initialize().catch((err: Error) => console.log(err));

  clients[id].on("qr", (qr: string) => {
    qrcode.generate(qr, { small: true });
  });

  clients[id].on("ready", () => console.log("Client is ready!"));

  clients[id].on("message", async (msg) => {
    try {
      if (
        process.env.PROCCESS_MESSAGE_FROM_CLIENT &&
        msg.from !== "status@broadcast"
      ) {
        const contact = await msg.getContact();
        console.log(contact, msg.from);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

startClient("wpp-web");

async function sendMessage(
  phoneNumber: string,
  message: string
): Promise<SendMessageResponse> {
  const client = clients["wpp-web"];
  if (client) {
    try {
      const regex = /^\+?\d{1,3}[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;

      if (!regex.test(phoneNumber)) {
        return {
          data: {
            msg: `Incorrect phone number format`,
            status: 401,
          },
        };
      }

      await client.sendMessage(`${phoneNumber}@c.us`, message);

      return {
        data: {
          msg: `Code sent to number ${phoneNumber}.`,
          status: 200,
        },
      };
    } catch (error) {
      return {
        data: {
          msg: `Error sending message to number ${phoneNumber}.`,
          status: 500,
        },
      };
    }
  } else {
    return {
      data: {
        msg: `Client not found for ID 'wpp-web'.`,
        status: 404,
      },
    };
  }
}

export { sendMessage };
