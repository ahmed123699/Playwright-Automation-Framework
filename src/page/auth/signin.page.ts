import { Page, TestInfo } from "@playwright/test";
import { SignInData } from "@interfaces/auth/signin.interface";
import { LocatorInfo } from "@interfaces/locator.info.interface";
import { AuthBasePage } from "@page/auth/auth.base.page";
import { PlaywrightActionFactory } from "@utilities/playwright.actions.utils";
import { PlaywrightVerificationFactory } from "@utilities/playwright.verifications.utils";

export class SignInPage extends AuthBasePage {
  private readonly locators: Record<string, LocatorInfo>;
  private readonly playwrightActionFactory: PlaywrightActionFactory;
  private readonly playwrightVerificationFactory: PlaywrightVerificationFactory;

  public constructor(page: Page, testInfo: TestInfo) {
    super(page);
    this.playwrightActionFactory = new PlaywrightActionFactory(page, testInfo);
    this.playwrightVerificationFactory = new PlaywrightVerificationFactory(page, testInfo);
    this.locators = {
      signInButton: {
        description: "Sign In tab or button",
        locator: this.page.locator('//button[normalize-space()="Sign In"]'),
      },
      mainPageHeading: {
        description: 'Main page Heading The Journal Serious Traders',
        locator: this.page.locator('(//h1[contains(text(), "Your Edge Is Hiding in Your")])[1]'),
      },
      signInWithEmail: {
        description: 'SignIn with Email Instead button',
        locator: this.page.locator('//button[normalize-space()="Sign in with email instead"]'),
      },
      welcomeBackHeading: {
         description: 'Login Page Welcome Page Heading',
         locator:this.page.locator('//h1[normalize-space()="Welcome back"]'),
      },
      emailInput: {
        description: "Sign in email input",
        locator: this.page.locator('//label[normalize-space()="Email or Username"]//following::input[@inputmode="email"]'),
      },
      passwordInput: {
        description: "Sign in password input",
        locator: this.page.locator('(//label[normalize-space()="Password"]//following::input)[1]'),
      },
      loginButton: {
        description: "Login button",
        locator: this.page.locator('(//button[normalize-space()="Login"])[2]'),
      },
      dashboardHeading: {
        description: "Dashboard heading",
        locator: this.page.locator('//h1[normalize-space()="Dashboard"]'),
      },
    };
  }

  public async navigateToApplication(url: string): Promise<void> {
    await this.playwrightActionFactory.navigateToURL(url);
    await this.playwrightActionFactory.waitForDomLoad();
    await this.playwrightVerificationFactory.waitForVisibility(this.locators.mainPageHeading);
    await this.playwrightActionFactory.waitForSelector(this.locators.mainPageHeading);
    await this.playwrightVerificationFactory.expectElementExist(this.locators.mainPageHeading)
  }

  public async openSignInForm(): Promise<void> {
    await this.playwrightActionFactory.waitForDomLoad();
    await this.playwrightActionFactory.waitForSelector(this.locators.signInButton);
    await this.playwrightVerificationFactory.waitForVisibility(this.locators.signInButton);
    await this.playwrightActionFactory.click(this.locators.signInButton);
    await this.playwrightActionFactory.waitForDomLoad();
    await this.playwrightVerificationFactory.waitForVisibility(this.locators.welcomeBackHeading);
    await this.playwrightVerificationFactory.expectElementExist(this.locators.welcomeBackHeading);
    if (await this.locators.signInWithEmail.locator.isVisible()) {
        await this.playwrightActionFactory.waitForSelector(this.locators.signInWithEmail);  
        await this.playwrightActionFactory.click(this.locators.signInWithEmail);
    }
}


  public async enterEmail(email: string): Promise<void> {
    await this.playwrightActionFactory.waitForSelector(this.locators.emailInput);
    await this.playwrightActionFactory.sendKeys(this.locators.emailInput, email);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.playwrightActionFactory.waitForSelector(this.locators.passwordInput);
    await this.playwrightActionFactory.sendKeys(this.locators.passwordInput, password, true);
  }

  public async clickLogin(): Promise<void> {
    await this.playwrightActionFactory.waitForSelector(this.locators.loginButton);
    await this.playwrightActionFactory.click(this.locators.loginButton);
  }

  public async expectDashboardHeading(): Promise<void> {
    await this.playwrightActionFactory.waitForSelector(this.locators.dashboardHeading);
    await this.playwrightVerificationFactory.expectElementExist(this.locators.dashboardHeading);
  }

  public async login(data: SignInData): Promise<void> {
    await this.enterEmail(data.email);
    await this.enterPassword(data.password);
    await this.clickLogin();
  }

  public async expectAuthenticatedSession(): Promise<void> {
    await super.expectAuthenticatedSession();
    await this.playwrightVerificationFactory.expectElementExist({
      description: "Authenticated user menu",
      locator: this.page.getByRole("button", { name: /log out|logout|sign out|profile/i }).first(),
    });
  }
}
