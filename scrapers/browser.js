const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

let browserInstance = null;

async function getBrowser() {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
  });

  browserInstance.on("disconnected", () => {
    browserInstance = null;
  });

  return browserInstance;
}

async function scrapeWithBrowser(url, extractFn, options = {}) {
  const {
    waitFor = "networkidle2",
    timeout = 30000,
    waitSelector = null,
  } = options;

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    await page.goto(url, {
      waitUntil: waitFor,
      timeout,
    });

    if (waitSelector) {
      await page.waitForSelector(waitSelector, { timeout: 15000 }).catch(() => {
        // selector didn't appear, continue anyway
      });
    }

    // Small delay for any late JS rendering
    await new Promise((r) => setTimeout(r, 2000));

    const result = await page.evaluate(extractFn);
    return result;
  } finally {
    await page.close();
  }
}

async function closeBrowser() {
  if (!browserInstance) return;
  const instance = browserInstance;
  browserInstance = null;
  try {
    const pid = instance.process()?.pid;
    await Promise.race([
      instance.close(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Browser close timed out")), 10000)
      ),
    ]);
    console.log("Browser closed");
    // Force-kill if the process is still around
    if (pid) {
      try { process.kill(pid, 0); process.kill(pid, "SIGKILL"); } catch {}
    }
  } catch (err) {
    console.error("Browser close error:", err.message);
    const pid = instance.process()?.pid;
    if (pid) {
      try { process.kill(pid, "SIGKILL"); } catch {}
    }
  }
}

module.exports = { getBrowser, scrapeWithBrowser, closeBrowser };
