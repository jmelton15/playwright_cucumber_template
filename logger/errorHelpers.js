function getErrorString(errorMessage) {
    let readableError = errorMessage;
    if(errorMessage.includes("waiting for locator")) {
        const regex = /locator\((.*?)\)/;
        const matchedSelector = errorMessage.match(regex)
        const selector = matchedSelector[1]
        readableError = `Web Element Selector Appears to Be Incorrect. Please Double Check Selector
        SELECTOR: ${selector}`;
    }
    if(errorMessage.includes(`navigating to "http`)) {
        const regex = /"([^"]*)/;
        const matchedUrl = errorMessage.match(regex)
        const url = matchedUrl[1]
        readableError = `Going to ${url} timed-out. If error continues, check connectivity to app`;
    }
    
    return readableError;
}



module.exports = {
    getErrorString
}