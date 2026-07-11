import { Message } from "mailosaur/lib/models";

export const extractOtpFromEmail = (message: Message): string => {
  const content = `${message.text?.body ?? ""} ${message.html?.body ?? ""}`;
  const otpMatch = content.match(/\b(\d{4,8})\b/);

  if (!otpMatch?.[1]) {
    throw new Error("Verification code not found in Mailosaur email body.");
  }

  return otpMatch[1];
};
