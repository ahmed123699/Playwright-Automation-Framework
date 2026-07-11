import type { PlaywrightTestConfig } from "@playwright/test";
import { devices, defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import os from "node:os";

// Load environment variables (.env.test is the default for this project)
const env = process.env.NODE_ENV || "test";
dotenv.config({ path: `./src/config/.env.${env}` });

const { URL, EmbedScreenshotsInReport } = process.env;
const embed_screenshots = EmbedScreenshotsInReport === "true";

const xrayOptions = {
  embedAnnotationsAsProperties: true,
  textContentAnnotations: ["test_summary"],
  embedAttachmentsAsProperty: embed_screenshots ? "testrun_evidence" : undefined,
  outputFile: "./xray-report.xml",
  embedAttachments: embed_screenshots,
  removeSkippedTests: false,
  addTestCases: true,
  addTestSuites: true,
};

const reporters: PlaywrightTestConfig["reporter"] = [["list", { printSteps: true }]];

if (process.env.ENABLE_XRAY_REPORT === "true") {
  reporters.push(["@xray-app/playwright-junit-reporter", { ...xrayOptions }]);
}

reporters.push(
  [
    "allure-playwright",
    {
      detail: true,
      outputFolder: "allure-results",
      suiteTitle: true,
      environmentInfo: {
        OS: os.platform(),
        Architecture: os.arch(),
        NodeVersion: process.version,
        url: URL,
      },
      categories: [
        {
          name: "Missing file errors",
          messageRegex: /^ENOENT: no such file or directory/,
        },
      ],
    },
  ],
  ["html", { open: "never" }],
);

const config: PlaywrightTestConfig = {
  testDir: "./src/specs/",
  timeout: 90 * 1000,
  expect: {
    timeout: 60 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,

  reporter: reporters,

  use: {
    video: "retain-on-failure",
    actionTimeout: 45 * 1000,
    baseURL: URL,
    headless: process.env.CI ? true : false,
    trace: "on-first-retry",
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      args: ["--window-size=1920,1080", "--disable-resizable"],
    },
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "Chromium",
      dependencies: ["setup"], 
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./src/cookies/user.json", 
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ["--window-size=1920,1080", "--disable-resizable"],
        },
      },
    },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //   },
    // },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    // },
  ],
};

export default config;