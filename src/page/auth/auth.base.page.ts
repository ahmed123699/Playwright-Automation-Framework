import { expect, Locator, Page } from "@playwright/test";

export class AuthBasePage {
  protected readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  protected getByRoleButton(name: RegExp): Locator {
    return this.page.getByRole("button", { name }).first();
  }

  protected getInputByCandidates(selector: string): Locator {
    return this.page.locator(selector).first();
  }

  public async openAuthHome(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  public async waitForElement(locator: Locator, timeout = 30000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  public async expectAuthenticatedSession(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard|journal|app|home/i, { timeout: 45000 });
  }
}
