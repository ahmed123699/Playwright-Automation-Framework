import { Page, TestInfo } from "@playwright/test";
import { LocatorInfo } from "@interfaces/locator.info.interface";
import { AuthBasePage } from "@page/auth/auth.base.page"; // Base page configuration
import { PlaywrightActionFactory } from "@utilities/playwright.actions.utils";
import { PlaywrightVerificationFactory } from "@utilities/playwright.verifications.utils";
import { TradeDetails } from "@interfaces/trade/trades.interface";

export class TradesPage extends AuthBasePage {
  private readonly locators: Record<string, LocatorInfo>;
  private readonly playwrightActionFactory: PlaywrightActionFactory;
  private readonly playwrightVerificationFactory: PlaywrightVerificationFactory;

  public constructor(page: Page, testInfo: TestInfo) {
    super(page);
    this.playwrightActionFactory = new PlaywrightActionFactory(page, testInfo);
    this.playwrightVerificationFactory = new PlaywrightVerificationFactory(page, testInfo);
    
    this.locators = {
      dashboardPageHeading: {
        description: 'Dashboard Page Heading',
        locator: this.page.locator('//h1[normalize-space()="Dashboard"]'),
      },
      tradesTab: {
        description: "Trades Navigation Tab",
        locator: this.page.locator('(//a[normalize-space()="Trades"])[1]'),
      },
      tradesPageHeading: {
        description: 'Trades Page Heading',
        locator: this.page.locator('//h1[normalize-space()="Trades"]'),
      },
      newTradeButton: {
        description: "New Trade Button",
        locator: this.page.locator('(//button[normalize-space()="New Trade"])'),
      },
      exportTradeButton:{
        description: "Export Trade Button",
        locator: this.page.locator('(//button[normalize-space()="New Trade"])'),
      },
      newTradePageHeading: {
        description: 'New Trade Page Heading',
        locator: this.page.locator('(//h1[normalize-space()="New Trade"])'),
      },
      symbolInputField: {
        description: 'Symbol Input Field',
        locator: this.page.locator('(//label[normalize-space()="Symbol"]//following::input)[1]'),
      },
      tradeSideButton: {
        description: 'Trade Side button',
        locator: this.page.locator('(//label[normalize-space()="Trade side"]//following::button)[1]'),
      },
      entryPriceInputField: {
        description: 'Entry price input field',
        locator: this.page.locator('(//label[normalize-space()="Entry price"]//following::input)[1]'),
      },
      exitPriceInputField: {
        description: 'Exit price input field',
        locator: this.page.locator('(//label[normalize-space()="Exit price"]//following::input)[1]'),
      },
      lotSizeInputField: {
        description: 'lot Size input field',
        locator: this.page.locator('(//label[normalize-space()="Lot size/Quantity/Shares"]//following::input)[1]'),
      },
      feesAndCommissionsInputField: {
        description: 'Fees and commissions input field',
        locator: this.page.locator('(//label[normalize-space()="Fees and commissions"]//following::input)[1]'),
      },
      tradePlanTextarea:{
        description: 'Trade plan textarea field',
        locator: this.page.locator('(//label[normalize-space()="Trade Plan"]//following::textarea)[1]')
      },
      notesTextarea:{
        description: 'Notes textarea field',
        locator: this.page.locator('(//label[normalize-space()="Notes"]//following::textarea)[1]')
      },
      saveTradeButton:{
        description: 'Save trade button',
        locator: this.page.locator('(//button[normalize-space()="Save trade"])[1]'),
      },
      tradeCreatedSuccessfullyBanner: {
        description: 'Trade created successfully Banner',
        locator: this.page.locator('(//div[normalize-space()="Trade created successfully"])[1]')
      },
      cookiesBannerAcceptAll:{
        description: 'Cookies Banner Accept all button',
        locator: this.page.locator('(//p[contains(text(),"We use cookies to improve your experience.")]//following::button[normalize-space()="Accept All"])'),
      },
    };
  }

  public async navigateToTradesTab(): Promise<void> {
    await this.playwrightActionFactory.waitForDomLoad();
    await this.playwrightVerificationFactory.waitForVisibility(this.locators.dashboardPageHeading);
    await this.playwrightActionFactory.waitForSelector(this.locators.dashboardPageHeading);
    await this.playwrightVerificationFactory.expectElementExist(this.locators.dashboardPageHeading);
    await this.playwrightActionFactory.waitForSelector(this.locators.tradesTab);
    await this.playwrightActionFactory.click(this.locators.tradesTab);
    await this.playwrightActionFactory.waitForDomLoad();
  }

  public async NewTradePage(): Promise<void> {    
    await this.playwrightVerificationFactory.waitForVisibility(this.locators.tradesPageHeading);
    await this.playwrightActionFactory.waitForSelector(this.locators.tradesPageHeading);
    await this.playwrightVerificationFactory.expectElementExist(this.locators.tradesPageHeading);
    await this.playwrightActionFactory.waitForSelector(this.locators.newTradeButton);
    await this.playwrightActionFactory.click(this.locators.newTradeButton);
    await this.playwrightVerificationFactory.waitForVisibility(this.locators.newTradePageHeading);
    await this.playwrightActionFactory.waitForSelector(this.locators.newTradePageHeading);
    await this.playwrightVerificationFactory.expectElementExist(this.locators.newTradePageHeading);
    if (await this.locators.cookiesBannerAcceptAll.locator.isVisible()) {
      await this.playwrightActionFactory.waitForSelector(this.locators.cookiesBannerAcceptAll);  
      await this.playwrightActionFactory.click(this.locators.cookiesBannerAcceptAll);
  }
  }

  public async EnterTradeDetails(details: TradeDetails): Promise<void> { 
    await this.playwrightActionFactory.waitForSelector(this.locators.symbolInputField);
    await this.playwrightActionFactory.sendKeys(this.locators.symbolInputField, details.symbol);
    await this.playwrightActionFactory.waitForSelector(this.locators.entryPriceInputField);
    await this.playwrightActionFactory.sendKeys(this.locators.entryPriceInputField, details.entryPrice.toString());
    await this.playwrightActionFactory.waitForSelector(this.locators.tradeSideButton);
    await this.playwrightActionFactory.click(this.locators.tradeSideButton);
    await this.playwrightActionFactory.waitForSelector(this.locators.exitPriceInputField);
    await this.playwrightActionFactory.sendKeys(this.locators.exitPriceInputField, details.exitPrice.toString());
    await this.playwrightActionFactory.waitForSelector(this.locators.lotSizeInputField);
    await this.playwrightActionFactory.sendKeys(this.locators.lotSizeInputField, details.lotSize.toString());
    await this.playwrightActionFactory.waitForSelector(this.locators.feesAndCommissionsInputField);
    await this.playwrightActionFactory.sendKeys(this.locators.feesAndCommissionsInputField, details.feesAndCommission.toString());
    await this.playwrightActionFactory.waitForSelector(this.locators.tradePlanTextarea);
    await this.playwrightActionFactory.sendKeys(this.locators.tradePlanTextarea, details.tradePlan);
    await this.playwrightActionFactory.waitForSelector(this.locators.notesTextarea);
    await this.playwrightActionFactory.sendKeys(this.locators.notesTextarea, details.notes);
    await this.playwrightActionFactory.waitForSelector(this.locators.saveTradeButton);
    await this.playwrightActionFactory.click(this.locators.saveTradeButton);
  }

  public async expectTradeSuccessBanner(): Promise<void> {
    await this.playwrightActionFactory.waitForSelector(this.locators.tradeCreatedSuccessfullyBanner);
    await this.playwrightVerificationFactory.expectElementExist(this.locators.tradeCreatedSuccessfullyBanner);
  }
}