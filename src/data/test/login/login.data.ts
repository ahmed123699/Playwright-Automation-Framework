import { generateRandomAlphanumeric } from "@utilities/random.utils";
import { getEnvVariable } from "@utilities/env.utils";

export interface SignUpSignInData {
  email: string;
  otpCode: string;
  password: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const getApplicationUrl = (): string => getEnvVariable("URL");

export const getLoginData = (): LoginData => {
  const email =
    process.env.signinEmail?.trim() ||
    process.env.SIGNIN_EMAIL?.trim() ||
    process.env.SIGNUP_FIXED_EMAIL?.trim() ||
    "";
  const password =
    process.env.signinPassword?.trim() ||
    process.env.SIGNIN_PASSWORD?.trim() ||
    process.env.SIGNUP_PASSWORD?.trim() ||
    "";

  if (!email) {
    throw new Error("signinEmail must be set in src/config/.env.test.");
  }

  if (!password) {
    throw new Error("signinPassword must be set in src/config/.env.test.");
  }

  return {
    email,
    password,
  };
};

export const getSignUpSignInData = (): SignUpSignInData => {
  const email = process.env.SIGNUP_FIXED_EMAIL || process.env.signinEmail || "";
  const otpCode = process.env.SIGNUP_OTP_CODE || "";
  const password = process.env.SIGNUP_PASSWORD || process.env.signinPassword || "TradeInsights@12345";
  const username = `ti_auto_${generateRandomAlphanumeric(8)}`.toLowerCase();

  if (!email) {
    throw new Error("SIGNUP_FIXED_EMAIL or signinEmail must be set in src/config/.env.test.");
  }

  if (!otpCode) {
    throw new Error("SIGNUP_OTP_CODE is not set. Update it before running signup tests.");
  }

  return {
    email,
    otpCode,
    password,
    username,
  };
};
