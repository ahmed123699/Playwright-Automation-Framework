import { test as setup } from '@playwright/test';
import { SignInPage } from '@page/auth/signin.page';
import { getLoginData, getApplicationUrl } from '@data/test/login/login.data';

const cookieFile = './src/cookies/user.json'; 

setup('User Login and Save Cookies', async ({ page }, testInfo) => {
  const loginData = getLoginData();
  const applicationUrl = getApplicationUrl();
  
  const signInPage = new SignInPage(page, testInfo as any); 

  await signInPage.navigateToApplication(applicationUrl);
  await signInPage.openSignInForm();

  await signInPage.enterEmail(loginData.email);
  await signInPage.enterPassword(loginData.password);
  await signInPage.clickLogin();

  await signInPage.expectDashboardHeading();

  await page.context().storageState({ path: cookieFile });
  console.log("🚀 Cookies saved into src/cookies/user.json successfully!");
});