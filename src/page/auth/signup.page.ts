import { Page, TestInfo } from "@playwright/test";
import { SignUpData } from "@interfaces/auth/signup.interface";
import { LocatorInfo } from "@interfaces/locator.info.interface";
import { AuthBasePage } from "@page/auth/auth.base.page";
import { PlaywrightActionFactory } from "@utilities/playwright.actions.utils";
import { PlaywrightVerificationFactory } from "@utilities/playwright.verifications.utils";

export class SignUpPage extends AuthBasePage {
  private readonly locators: Record<string, LocatorInfo>;
  private readonly playwrightActionFactory: PlaywrightActionFactory;
  private readonly playwrightVerificationFactory: PlaywrightVerificationFactory;

  public constructor(page: Page, testInfo: TestInfo) {
    super(page);
    this.playwrightActionFactory = new PlaywrightActionFactory(page, testInfo);
    this.playwrightVerificationFactory = new PlaywrightVerificationFactory(page, testInfo);
    this.locators = {
      signUpButton: {
        description: "Sign Up tab or button",
        locator: this.page.locator('//button[normalize-space()="Start Free"]'),
      },
      createAccountHeading:{
      description : "Create your account Heading",
      locator: this.page.locator('//h1[normalize-space()="Create your account"]')
      },
      emailInput: {
        description: "Sign up email input",
        locator: this.page.locator('input[name*="email" i], input[type="email"]').first(),
      },
      usernameInput: {
        description: "Sign up username input",
        locator: this.page.locator('//label[normalize-space()="Username"]//following::input[@name="username"]'),
      },
      passwordInput: {
        description: "Sign up password input",
        locator: this.page.locator('//label[normalize-space()="Password"]//following::input[@name="password"]'),
      },
      createAccountButton: {
        description: "Create account button",
        locator: this.page.locator('//button[normalize-space()="Create Account" and @type="submit"]'),
      },
      otpInput: {
        description: "OTP input",
        locator: this.page
          .locator('//label[normalize-space()="Verification Code"]//following::input[@placeholder="6-digit code"]'),
      },
      verifyButton: {
        description: "Verify OTP button",
        locator: this.page.locator('//button[normalize-space()="Verify Email"]'),
      },
      verificationNotice: {
        description: "Verification code sent notice",
        locator: this.page.locator("//p[normalize-space()='Enter the 6-digit code sent to your email']"),
      },
    };
  }

  private getLocator(name: string): LocatorInfo {
    const locatorInfo = this.locators[name];
    if (!locatorInfo) {
      throw new Error(`Locator '${name}' is not configured.`);
    }
    return locatorInfo;
  }

  public async navigateToApplication(url: string): Promise<void> {
    await this.playwrightActionFactory.navigateToURL(url);
    await this.playwrightActionFactory.waitForDomLoad();
  }

  public async openSignUpForm(): Promise<void> {
    await this.playwrightVerificationFactory.waitForVisibility(this.locators.signUpButton);
    await this.playwrightActionFactory.click(this.locators.signUpButton);

  }

  public async fillSignUpDetails(data: SignUpData): Promise<void> {
    await this.playwrightActionFactory.waitForSelector(this.locators.emailInput);
    await this.playwrightActionFactory.sendKeys(this.getLocator("emailInput"), data.email);
    await this.playwrightActionFactory.waitForSelector(this.locators.usernameInput);
    await this.playwrightActionFactory.sendKeys(this.getLocator("usernameInput"), data.username);
    await this.playwrightActionFactory.waitForSelector(this.locators.passwordInput);
    await this.playwrightActionFactory.sendKeys(this.getLocator("passwordInput"), data.password);
  }

  public async submitCreate(): Promise<void> {
    await this.playwrightActionFactory.waitForSelector(this.locators.createAccountButton);
    await this.playwrightActionFactory.click(this.getLocator("createAccountButton"));
  }

  public async expectVerificationPrompt(): Promise<void> {
   await this.playwrightVerificationFactory.waitForVisibility(this.locators.verificationNotice);
   await this.playwrightVerificationFactory.expectElementExist(this.locators.verificationNotice);
  }

  public async verifyWithOtp(otpCode: string): Promise<void> {
    await this.playwrightActionFactory.sendKeys(this.getLocator("otpInput"), otpCode);
    await this.playwrightActionFactory.click(this.getLocator("verifyButton"));
  }
}
