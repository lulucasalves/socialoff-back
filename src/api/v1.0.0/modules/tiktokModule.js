const puppeteer = require('puppeteer')
require('dotenv/config')
const chromium = require('chrome-aws-lambda')

const myargs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
  ...chromium.args
]

async function tiktokModule(url) {
  if (!url.includes('tiktok')) {
    throw Error('invalid url')
  }
  const timeout = 30000

  const browser = await chromium.puppeteer.launch({
    headless: true,
    args: myargs,
    userDataDir: './myUserDataDir',
    timeout,
    defaultViewport: chromium.defaultViewport,
    ignoreHTTPSErrors: true,
    executablePath: await chromium.executablePath
  })

  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
  )
  await page.goto(process.env.URL, { timeout })

  await page.waitForSelector('#sf_url')

  await page.type('#sf_url', url)
  await page.click('#sf_submit')

  await page.waitForSelector('.drop-down-box')

  await page.click('.drop-down-box')

  await page.waitForSelector('.link-group .link-download')

  const link = await page.$eval('.link-group .link-download', (x) =>
    x.getAttribute('href')
  )

  await browser.close()

  return link
}

module.exports = tiktokModule
