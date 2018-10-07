import 'dotenv/config'
import path from 'path'
import Puppeteer from 'puppeteer'

(async () => {
  const loginUrl  = process.env.LOGIN_URL
  const loginUser = process.env.USERNAME
  const loginPass = process.env.PASSWORD

  console.log(`Opening ${loginUrl} ...`)

  const browser = await Puppeteer.launch({ headless: true })
  const page    = await browser.newPage()

  await page.setViewport({ width: 1920, height: 926 })
  await page.goto(loginUrl)

  const selectorUser   = '#UserUsername'
  const selectorPass   = '#UserPassword'
  const selectorSubmit = '.btn'

  console.log('Typing username ...')

  await page.click(selectorUser)
  await page.keyboard.type(loginUser)

  console.log('Typing password ...')

  await page.click(selectorPass)
  await page.keyboard.type(loginPass)

  console.log('Logging in ...')

  await Promise.all([
    page.click(selectorSubmit),
    page.waitForNavigation(),
  ])

  console.log('Logged in!')

  const searchUrl  = process.env.SEARCH_URL
  const searchTerm = process.env.SEARCH_TERM

  console.log(`Searching for ${searchTerm} ...`)

  await page.goto(`${searchUrl}/${encodeURI(searchTerm)}`)

  console.log('Finding result columns ...')

  const results = await page.evaluate(() => {
    const cols = [].slice.call(document.querySelectorAll('.gallery > article'))

    const rows = cols.reduce((acc, curr) => {
      return acc.concat([].slice.call(curr.querySelectorAll(':scope > div')))
    }, [])

    return rows.length
  })

  console.log(`Found ${results} rows!`)

  console.log('Taking screenshot ...')

  await page.screenshot({
    fullPage: true,
    path: path.resolve(__dirname, 'screenshots/legendastv.png'),
  })

  console.log('Closing the browser ...')

  browser.close()

  console.log('Done!')
})()
