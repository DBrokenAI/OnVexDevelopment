import { Resend } from "resend";

let resend: Resend | undefined;

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!resend) {
    resend = new Resend(key);
  }
  return resend;
}

export type SendOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendOptions) {
  const from = process.env.RESEND_FROM ?? "OnVex <noreply@onvex.dev>";
  return await getClient().emails.send({ from, to, subject, html, text });
}
