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

function getAppUrl(filePath) {
    let fileNameParts = [];
    if(filePath.includes("\\")) {
        fileNameParts = filePath.split("\\");
    } else [
        fileNameParts = filePath.split("/")
    ]
    let fileName = fileNameParts[fileNameParts.length - 1].split(".")[0];

    let url = "";
    switch(fileName.toLowerCase()) {
        case "dmp":
            url = process.env.DMP_URL;
            break;
        case "ured":
            url = process.env.URED_URL;
            break;
        case "irad_admin":
            url = process.env.IRAD_ADMIN_URL;
            break;
        case "search":
            url = process.env.SEARCH_URL;
            break;
        case "grants":
            url = process.env.GRANTS_URL;
            break;
    }
    return url;
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

/**
 *  Handles getting the line numbers from a test scenario of all the steps that may have failed
 * 
 * @param {object} pickleStep  -> single test step object from Cucumber (holds information about a given test step)
 * @param {object} gherkinDocument  -> Entire document from a given test scenario containing all the scenarios data, including steps
 * @returns {array} foundLines -> array containing the line number that the step can be found on in the .feature files
 */
function getFailedStepLineNumbers(pickleStep,gherkinDocument){
    let foundLines = [];
    const pickleStepText = pickleStep.text;
    const scenarios = gherkinDocument.feature.children
    let stepLineNumber = 0;
    scenarios.forEach((val) => {
        val.scenario.steps.forEach((step) => {
            if(step.text == pickleStepText) {
                stepLineNumber = step.location.line
                foundLines.push(stepLineNumber)
            }
        })
    })
    return foundLines;
}

/**
 * Handles getting the line corresponding line number in the excel test files for where failed test steps occurred
 * 
 * @param {array} stepLineNumbers -> array of numbers for various failed steps
 * @param {string} featureFilePath -> file path in string format of where the test excel file is located
 * @returns {array} promisedLineNUms -> array of promises (must be awaited in order to access data)
 */
function getExcelLineNumbers(stepLineNumbers,featureFilePath) {
    //Creates a new promise that will have to be "awaited" when calling this function
    const promisedLineNums = stepLineNumbers.map((stepLineNumber) => {
        const lineNumberToLookup = stepLineNumber - 1;
        return new Promise((resolve,reject) => {
            const fileStream = fs.createReadStream(featureFilePath)
            const rLine = readline.createInterface({
                input:fileStream,
                crlfDelay: Infinity
            });
    
            let currentLineNum = 0;
    
            rLine.on('line',(line) => {
                currentLineNum++;
                if(currentLineNum === lineNumberToLookup) {
                    resolve(line);
                    rLine.close();
                }
            })
            
            rLine.on('close',()=> {
                if(currentLineNum < lineNumberToLookup) {
                    reject(new Error(`Line number too large for total lines in file`))
                }
            })
    
            rLine.on("error",(error) => {
                reject(error)
            })
        })
    })
    return promisedLineNums;
}

function parseExcelLineNums(excelLineNums) {
    const parsedLineNums = excelLineNums.map((lineNum) => {
        const stringParts = lineNum.split(':')
        const excelLineNum = stringParts[1].trim();
        return excelLineNum;
    })
    return parsedLineNums;
}

async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve,time));
}

module.exports = {
    authenticate,
    getFailedStepLineNumbers,
    getExcelLineNumbers,
    parseExcelLineNums,
    sleep,
    createScreenshot,
    creatVideoBuffer,
    getAppUrl,
    getSessionCookies
}