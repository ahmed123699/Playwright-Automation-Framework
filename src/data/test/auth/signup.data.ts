import { SignUpData } from "@interfaces/auth/signup.interface";
import { getEnvVariable } from "@utilities/env.utils";
import { extractOtpFromEmail } from "@utilities/mailosaur/mailosaur.otp.utils";
import { getEmailByRecipient } from "@utilities/mailosaur/mailosaur.utils";
import { generateRandomAlphanumeric } from "@utilities/random.utils";

export const getApplicationUrl = (): string => getEnvVariable("URL");

export const getSignUpData = (): SignUpData => {
  const domain = process.env.mailosaurDomain;
  if (!domain) {
    throw new Error("mailosaurDomain is not set. Add it in src/config/.env.test.");
  }

  if (!process.env.mailosaurApiKey || !process.env.mailosaurServerId) {
    throw new Error("mailosaurApiKey and mailosaurServerId must be set in src/config/.env.test.");
  }
  const email = `test${generateRandomAlphanumeric(8).toLowerCase()}@${domain}`;
  
  const password =
    process.env.signupPassword?.trim() ||
    process.env.signinPassword?.trim() ||
    process.env.SIGNUP_PASSWORD?.trim() ||
    "TradeInsights@12345";
    
  const username = `test${generateRandomAlphanumeric(8)}`.toLowerCase();

  return {
    email,
    otpCode: "",
    password,
    username,
  };
};
export const getSignUpOtpFromEmail = async (recipientEmail: string): Promise<string> => {
  const emailMessage = await getEmailByRecipient(recipientEmail);
  return extractOtpFromEmail(emailMessage);
};