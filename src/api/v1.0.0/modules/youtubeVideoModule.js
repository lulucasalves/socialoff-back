const puppeteer = require('puppeteer')
require('dotenv/config')

async function youtubeVideoModule(url) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  if (!url.includes('youtube')) {
    throw Error('invalid url')
  }

  try {
    await page.goto(process.env.URL)
  } catch {
    await page.goto(process.env.URL)
  }

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

module.exports = youtubeVideoModule
