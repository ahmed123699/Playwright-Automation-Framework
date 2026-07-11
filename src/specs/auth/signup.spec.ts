import { getApplicationUrl, getSignUpData, getSignUpOtpFromEmail } from "@data/test/auth/signup.data";
import { test } from "@fixtures/auth.fixtures";

test.describe.skip("TradeInsights SignUp", () => {
  test.skip("Sign Up with Mailosaur email verification", async ({ signUpPage }) => {
    const signUpData = getSignUpData();
    const applicationUrl = getApplicationUrl();

    await test.step("Navigate to application URL from env file", async () => {
      await signUpPage.navigateToApplication(applicationUrl);
      await signUpPage.openSignUpForm();
    });

    await test.step("Fill Sign Up details and submit Create", async () => {
      await signUpPage.fillSignUpDetails(signUpData);
      await signUpPage.submitCreate();
    });

    await test.step("Verify verification code step is displayed", async () => {
      await signUpPage.expectVerificationPrompt();
    });

    await test.step("Fetch OTP from Mailosaur inbox and verify account", async () => {
      const otpCode = await getSignUpOtpFromEmail(signUpData.email);
      await signUpPage.verifyWithOtp(otpCode);
    });
  });
});
