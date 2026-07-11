import { getApplicationUrl, getLoginData } from "@data/test/login/login.data";
import { test } from "@fixtures/auth.fixtures";

test.describe("TradeInsights Sign In", () => {
  test("Sign In with valid user", async ({ signInPage }) => {
    const loginData = getLoginData();
    const applicationUrl = getApplicationUrl();

    await test.step("Navigate to application URL from env file", async () => {
      await signInPage.navigateToApplication(applicationUrl);
      await signInPage.openSignInForm();
    });

    await test.step("Enter email using sendKeys", async () => {
      await signInPage.enterEmail(loginData.email);
    });

    await test.step("Enter password using sendKeys", async () => {
      await signInPage.enterPassword(loginData.password);
    });

    await test.step("Click Login button", async () => {
      await signInPage.clickLogin();
    });

    await test.step("And User Verify the Dashboard Heading", async () => {
      await signInPage.expectDashboardHeading();
    });
 
  });
});
