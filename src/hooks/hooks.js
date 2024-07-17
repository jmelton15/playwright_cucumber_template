const { Before,After, BeforeAll, AfterAll, Status,
    setDefaultTimeout,BeforeStep,AfterStep} = require("@cucumber/cucumber");
const {chromium} = require('@playwright/test');
const {pageFixture} = require("./pageFixture");
const {getFailedStepLineNumbers,createScreenshot,creatVideoBuffer} = require("./hooksHelpers")

let browser;
let page;
let browserContext;

/**
 * Hook that takes place before anything else .. the hook the precedes ALL
 *   This hook is currently used to:
 *  ** Setup the Logger class object (used to create custom error logging for test team)
 *  ** Setup the browser (currently set to be chrome) -> keep headless = true for Jenkins
 */
BeforeAll(async function() {
    browser = await chromium.launch({headless:false});
})


/**
 * Hook that takes place before each Scenario in a test file
 *   This hook currently handles:
 *  ** Setting up the browser context (this is for route handling and getting the page object)
 *  ** Setting session auth cookies to the browserContext to handle session authentication
 *  ** Handling the route information (as needed for adding headers to route or logging routing in general)
 *  ** Setting up the page object (this is used to handle DOM interaction on each web page)
 *  ** Setting up the pageFixture object 
 *    
 *
 */
Before(async function({pickle}) {
    browserContext = await browser.newContext({
        ignoreHTTPSErrors: true,
        recordVideo: {
            dir:'./test-results/videos/',
            size:{width:1280,height:720},
            fps:30,
            crf:20
        }
    });
    page = await browserContext.newPage();
    pageFixture.page = page;
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
 * 
 */
AfterStep(async function({gherkinDocument,pickleStep,pickle,result}) {
    //Screenshot on failure
    if(result?.status == Status.FAILED) {
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
    const videoBuffer = await creatVideoBuffer(pageFixture.page);
    if(videoBuffer) {
        await this.attach(videoBuffer,'video/mp4');
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
    await browser.close();
})
