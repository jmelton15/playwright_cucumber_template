require("dotenv").config();
const readline = require("readline")
const fs = require("fs")


/**
 * 
 * @param {object} page 
 * @param {object} pickle 
 * @returns screenshot image that can be attached to report
 */
async function createScreenshot(page,pickle) {
    return await page.screenshot({path:`${process.env.SCREENSHOT_SAVE_PATH}${pickle.name}.png`,type:"png"})
}

/**
 * 
 * @param {object} page 
 * @returns videoBuffer object that can be used to attach video to report
 */
async function creatVideoBuffer(page) {
    const videoPath = await page.video().path();
    if(videoPath) {
        const videoBuffer = await fs.promises.readFile(videoPath);
        return videoBuffer;
    } else {
        console.log("\nNo Video Could Be Generated For Cucumber Report!\n")
    }
}

/**
 * Handles session token authentication each time playwright navigates to a new route/page
 * 
 * @param {object} browserContext -> browser context that contains page and route objects 
 */
async function authenticate(browserContext) {
    await browserContext.route('**/*',async route => {
        console.log(route.request())
        console.log(route.request().headers())
        // console.log(await route.headers())
        console.log(await browserContext.cookies());
        route.continue();
    });
}



async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve,time));
}

module.exports = {
    authenticate,
    sleep,
    createScreenshot,
    creatVideoBuffer
}