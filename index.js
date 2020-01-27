const playwright = require('playwright');
const fs = require('fs');
const dir = './tmp';


const hangoutsUrl = 'https://hangouts.google.com/call/MXhvhhRgJTooTU3M4T-NAEEE';
const screenshotsDirectory = './screenshots';

const googleUser = process.env.GOOGLE_USER;
const googlePassword = process.env.GOOGLE_PASSWORD;

const enterKey = String.fromCharCode(13);

(async () => {
    const browser = await playwright.firefox.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(hangoutsUrl, { waitUntil: 'networkidle2' });

    console.log('Attempting to enter username');
    await page.type('#identifierId', googleUser);

    console.log('Hitting "Enter" to get to password');
    await page.keyboard.press(enterKey);
    await page.waitForLoadState({ waitUntil: 'networkidle2' });

    console.log('Attempting to enter password');
    await page.type('input[type^=password]', googlePassword);

    console.log('Hitting "Enter" to login');
    await page.keyboard.press(enterKey);
    await page.waitFor(1000)
    await page.waitForLoadState({ waitUntil: 'networkidle2' });

    const joinHangout = await page.$("//span[text()='Join Hangout']");

    if (joinHangout) {
        await joinHangout.click();
    } else {
        throw new Error("'Join Hangout' button not found");
    }
    await page.waitFor(1000)
    await page.waitForLoadState({ waitUntil: 'networkidle2' });


    if (!fs.existsSync(screenshotsDirectory)){
        fs.mkdirSync(screenshotsDirectory);
    }
    
    const now = new Date();
    await page.screenshot({ path: `${screenshotsDirectory}/hangouts-${now.toISOString()}.png` });
    await browser.close();
  
})();