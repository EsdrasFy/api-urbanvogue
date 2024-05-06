import nodemailer from 'nodemailer';

export function MailerHTML({
  html,
  email
}: {
  html: string;
  email: string;
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "contatoesdrasoficial@gmail.com",
        pass: "xcxjmpheutkwxdsi",
      },
    });

    transport.sendMail({
      from: "Urban Vogue",
      to: email,
      subject: "Send Code",
      html: html,
    })
    .then((response) => {
      resolve(true);
    })
    .catch((err) => {
      console.error("Erro ao enviar e-mail:", err);
      resolve(false);
    });
  });
}
