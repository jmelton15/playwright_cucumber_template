const { Before,After, BeforeAll, AfterAll, Status,
    setDefaultTimeout,BeforeStep,AfterStep} = require("@cucumber/cucumber");
const {chromium} = require('@playwright/test');
const {pageFixture} = require("./pageFixture");
const {Logger} = require("../../logger/logger");
const {getFailedStepLineNumbers,getExcelLineNumbers,parseExcelLineNums,
    createScreenshot,creatVideoBuffer,getSessionCookies} = require("./hooksHelpers")

const BUILD_TYPE = process.env.BUILD_TYPE || "test"
let browser;
let page;
let browserContext;
let logger;

/**
 * Hook that takes place before anything else .. the hook the precedes ALL
 *   This hook is currently used to:
 *  ** Setup the Logger class object (used to create custom error logging for test team)
 *  ** Setup the browser (currently set to be chrome) -> keep headless = true for Jenkins
 */
BeforeAll(async function() {
    logger = new Logger();
    await logger.setupExcelFile();
    if(BUILD_TYPE == "Jenkins-Build") {
        browser = await chromium.launch({headless:true});
    }
    if(BUILD_TYPE == "test") {
        browser = await chromium.launch({headless:false});
    }
})


/**
 * Hook that takes place before each Scenario in a test file
 *   This hook currently handles:
 *  ** Setting up the browser context (this is for route handling and getting the page object)
 *  ** Setting session auth cookies to the browserContext to handle session authentication
 *  ** Handling the route information (as needed for adding headers to route or logging routing in general)
 *  ** Setting up the page object (this is used to handle DOM interaction on each web page)
 *  ** Setting up the pageFixture object 
 *     (we use this to store the page object and the logger object to be used in other classes)
 *
 */
Before(async function({pickle}) {
    if(BUILD_TYPE == "test") {
        browserContext = await browser.newContext({
            ignoreHTTPSErrors: true,
            recordVideo: {
                dir:'./test-results/videos/',
                size:{width:1280,height:720},
                fps:30,
                crf:20
            }
        });
    } else {
        browserContext = await browser.newContext({
            ignoreHTTPSErrors: true
        });
    }
    if(BUILD_TYPE == "Jenkins-Build") {
        const sessionCookies = await getSessionCookies(pickle);
        await browserContext.addCookies(sessionCookies);
    }
    page = await browserContext.newPage();
    pageFixture.page = page;
    pageFixture.logger = logger;
})

//testCase
//steps.location.line

/**
 *  const timeStamp = logObject["Timestamp"];
        const featureName = logObject["FeatureName"]
        const scenarioName = logObject["ScenarioName"]
        const stepLineNumber = logObject["StepLineNumber"]
        const errorMessage = logObject["Result"]
        const excelLineNumber = logObject["ExcelLineNumber"]
 */
//{gherkinDocument,pickleStep,pickle,result}
/**
 * Hook that takes place after each step inside of a test Scenario
 *  Currently this handles:
 *  ** Taking screenshots on step failure
 *  ** Gather various data points from each step on failure to update the custom error logger
 */
AfterStep(async function({gherkinDocument,pickleStep,pickle,result}) {
    //Screenshot on failure
    if(result?.status == Status.FAILED) {
        let failedStepLineNums = getFailedStepLineNumbers(pickleStep,gherkinDocument);
        const featureFilepath = pickle.uri;
        const filepathParts = featureFilepath.split("\\")
        const featureName = filepathParts[filepathParts.length - 1]
        const scenarioName = pickle.name;
        let excelLineNumbers = getExcelLineNumbers(failedStepLineNums,featureFilepath);
        excelLineNumbers = await Promise.all(excelLineNumbers)
        parsedExcelLineNumbers = parseExcelLineNums(excelLineNumbers);
        await logger.addLog(
            {"StepLineNumbers":failedStepLineNums},
            {"FeatureName":featureName},
            {"ScenarioName":scenarioName},
            {"Result":result},
            {"ExcelLineNumbers":parsedExcelLineNumbers}
        )
        logger.addLineNumToCache({
            "FeatureFileLineNums":failedStepLineNums,
            "ExcelFileLineNums":parsedExcelLineNumbers
        })
        const image = await createScreenshot(pageFixture.page,pickle)
        await this.attach(image,"image/png");
    }
});

/**
 * Hook that takes place after each test scenario
 * Currently Handles:
 *   ** Closing the page object
 *   ** Closing the browser context object
 */
After(async function({pickle,result}) {
    if(BUILD_TYPE == "test") {
        const videoBuffer = await creatVideoBuffer(pageFixture.page);
        if(videoBuffer) {
            await this.attach(videoBuffer,'video/mp4');
        }
    }
    await page.close();
    await browserContext.close();    
})

/**
 * Hook that takes place after all the test steps and scenarios have completed
 * Currently handles:
 *  ** Closing the browser object all together
 */
AfterAll(async function() {
    if(BUILD_TYPE == "Jenkins-Build") {
        delete process.env.SESSION_COOKIES;
    }
    await logger.writeToFailedLineCache();
    await browser.close();
})
