import { getApplicationUrl, getTradeTestData } from "@data/trades/trades.data";
import { getLoginData } from "@data/test/login/login.data";
import { test } from "@fixtures/auth.fixtures";
import fs from 'fs'; 

test.describe("TradeInsights Trade Execution Flows", () => {
  let applicationUrl: string;
  const cookiePath = './src/cookies/user.json';
  test.beforeEach(async ({ tradesPage, signInPage }) => {
    applicationUrl = getApplicationUrl();
    const loginData = getLoginData();
    if (fs.existsSync(cookiePath)) {
      console.log("🚀 Navigating directly to dashboard sub-route with injected session...");
      const targetPage = (tradesPage as any).page; 
      await targetPage.goto(`${applicationUrl}/app/dashboard`);
      await targetPage.waitForLoadState("domcontentloaded");
    } 
    else {
      console.log("🔑 Cookies not found! Executing manual login flow...");
      await signInPage.navigateToApplication(applicationUrl);
      await signInPage.openSignInForm();
      await signInPage.enterEmail(loginData.email);
      await signInPage.enterPassword(loginData.password);
      await signInPage.clickLogin();
      await signInPage.expectDashboardHeading();
    }
  });

  test("Should successfully navigate to trades and execute a new trade", async ({ tradesPage }) => {
    const tradeData = getTradeTestData();

    await test.step("Navigate to Trades tab configuration page", async () => {
      await tradesPage.navigateToTradesTab();
    });

    await test.step("And user enters the New Trade page", async () => {
      await tradesPage.NewTradePage();
    });

    await test.step("And user enters the Trade Details on the trade page", async () => {
      await tradesPage.EnterTradeDetails(tradeData.tradeDetails);
    });

    await test.step("Verify that the trade execution status is successful", async () => {
      await tradesPage.expectTradeSuccessBanner();
    });
  });
});