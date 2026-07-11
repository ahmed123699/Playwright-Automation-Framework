import { test as base, Page } from "@playwright/test";
import { SignInPage } from "@page/auth/signin.page";
import { SignUpPage } from "@page/auth/signup.page";
import { TradesPage } from "@page/auth/trades/trades.page";
import fs from 'fs';

type AuthFixtures = {
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  tradesPage: TradesPage;
};

const cookiePath = './src/cookies/user.json';
async function injectStorageStateIfExist(page: Page) {
  if (fs.existsSync(cookiePath)) {
    console.log("🔄 Fixture: Storage state found! Injecting session before initializing pages...");
    const state = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));
    await page.context().addCookies(state.cookies || []);
    if (state.origins && state.origins.length > 0) {
      for (const origin of state.origins) {
        await page.context().addInitScript((storageData: any) => {
          if (window.location.origin === storageData.origin) {
            for (const item of storageData.localStorage) {
              window.localStorage.setItem(item.name, item.value);
            }
          }
        }, { origin: origin.origin, localStorage: origin.localStorage });
      }
    }
  }
}

export const test = base.extend<AuthFixtures>({
  signInPage: async ({ page }, use, testInfo) => {
    await injectStorageStateIfExist(page);
    await use(new SignInPage(page, testInfo));
  },
  signUpPage: async ({ page }, use, testInfo) => {
    await injectStorageStateIfExist(page);
    await use(new SignUpPage(page, testInfo));
  },
  tradesPage: async ({ page }, use, testInfo) => {
    await injectStorageStateIfExist(page);
    await use(new TradesPage(page, testInfo));
  },
});

export { expect } from "@playwright/test";