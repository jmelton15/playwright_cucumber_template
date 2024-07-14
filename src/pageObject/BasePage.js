const { expect } = require('@playwright/test');
const {pageFixture} = require("../hooks/pageFixture");
const {getErrorLineNumber} = require("../../logger/errorHelpers")

/**
 * Class for to hold all the functions that will be used by every app/test suite
 *   This avoids redundancy and allows for a centralized code location if something 
 *    needs to be updated or added.
 */

exports.BasePage = class BasePage {


  constructor() {

  }
/**
 * } catch(err) {
        pageFixture.logger.createLogObject(
          {"Timestamp":pageFixture.logger.currentDatetime},
          {"ERROR":err},
          {"Test Method":"Go To URL"},
          {"URL": url},
          // {"Test Case Line Number":} 
        )
    }
 */
  /**
   * Takes in a URL in string format and calls the page.goto() method
   *  Goes to the given url in the browser
   * @param {string} url 
   */
  async navigateTo(url) {
    await pageFixture.page.goto(url);
  }


  /**
   * Handles the logic for clicking a given DOM element 
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async clickElement(selector) {
      await this.waitForSelector(selector)
      await pageFixture.page.locator(selector).click();
  }

    /**
   * Handles the logic for fully filling in a form input field
   *  fill for Playwright = setting the form field to the full string value
   *    Does not mimic typing each character of a string individually
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async fillFormField(selector,value) {
    await this.waitForSelector(selector)
    const element = await pageFixture.page.locator(selector);
    if(await this.isDate(element)) {
      await element.type(value);
    } else {
      await element.fill(value);
    }
  }

  /**
   * Handles the logic for fully filling in a form input field dynamically
   *  Dynamically in this case = creating a new, randomized value as the input
   *    fill for Playwright = setting the form field to the full string value
   *    Does not mimic typing each character of a string individually
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async fillFormFieldDynamic(selector,value) {
    await this.waitForSelector(selector)
    const element = await pageFixture.page.locator(selector);
    const randomNum = Math.floor(Math.random() * 1000 + 1);
    await element.fill(`${value}${randomNum}`);
  }

  /**
   * Handles the logic for getting the text of a DOM element
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async getElementText(selector) {
    await this.waitForSelector(selector)
    return await pageFixture.page.locator(selector).innerText();
  }

  /**
   * Handles the logic for verifying that the text of DOM element is equal to another text
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async verifyText(selector,textToVerify) {
    await this.waitForSelector(selector)
    const element = await pageFixture.page.locator(selector);
    let elementText = await element.innerText();
    if(!elementText || elementText == "") {
      elementText = await element.evaluate((ele) => ele.value);
    }
    let joinedText = "";
    if(elementText.includes("\n")) {
      const textParts = elementText.split("\n");
      joinedText = textParts.join(" ");
    }
    // textToVerify = textToVerify.trim();
    await expect(joinedText.toLowerCase()).toBe(textToVerify.toLowerCase());
  }
    

  /**
   * Handles the logic for verifying that the text of a DOM element includes the given text somewhere in it
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async verifyPartialText(selector,textToVerify) {
    await this.waitForSelector(selector)
    const element = await pageFixture.page.locator(selector);
    let elementText = await element.innerText();
    if(!elementText || elementText == "") {
      elementText = await element.evaluate((ele) => ele.value);
    }
    await expect(elementText.toLowerCase()).toContainText(textToVerify.toLowerCase());
  }

  /**
   *  Simple function that handles hovering over a web element
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async hoverOverElement(selector) {
    await this.waitForSelector(selector);
    await pageFixture.page.hover(selector);
  }

  /**
   * 
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   * @param {string} attributeName  -> represents the name of the attribute that you want to get the value of
   */
  async verifyAttribute(selector,expectedValue,attributeName) {
    await this.waitForSelector(selector);
    const attributeValue = await pageFixture.page.getAttribute(selector,attributeName);
    await expect(attributeValue.toLowerCase()).toContainText(expectedValue.toLowerCase());
  }

    /**
   * Handles the logic for verifiying that a DOM element exists on the current page
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async verifyElementExists(selector) {
      await this.waitForSelector(selector)
      await expect(pageFixture.page.locator(selector)).toHaveCount(1);
  }

    /**
   * Handles the logic for verifiying that a DOM element does NOT exist on the current page
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
    async verifyElementDoesNotExist(selector) {
      // await this.waitForSelector(selector)
      await expect(pageFixture.page.locator(selector)).not.toHaveCount(1);
    }

  /**
   * Handles the logic for selecting a single value from a dropdown list
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   * @param {string} selectValue -> represents the value you want to select from the Dropdown
   */
  async selectOneFromDropdown(selector,selectValue) {
    let actualValue = selectValue;
    await this.waitForSelector(selector)
    if(!actualValue) {
      actualValue = {index:2}
    }
    pageFixture.page.selectOption(selector,actualValue);
    await this.wait(3000);
  }

  /**
   *  Handles the logic of verifying if an html table is sorted according to ascending
   *   or descending
   * 
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   * @param {string} assertMethod -> represents the value of whether or not to do ascending or descending
   * @param {string} columnNumber -> represents the column number to verify the sort on
   */
  async verifySort(selector,columnNumber,assertMethod) {
    // await this.wait(2000);
    columnNumber = parseInt(columnNumber);
    if(assertMethod.toLowerCase() === 'ascending') {
      await this.waitForSelector(selector);
      const isAscending = await this.verifyAscendedTable(pageFixture.page,selector,columnNumber-1);
      await expect(isAscending).toBeTruthy();
    } 
    if(assertMethod.toLowerCase() === 'descending') {
      await this.waitForSelector(selector);
      const isDescending = await this.verifyDescendedTable(pageFixture.page,selector,columnNumber-1);
      await expect(isDescending).toBeTruthy();
    } 
  }

  async acceptPopup() {
    pageFixture.page('dialog', dialog => dialog.accept());
  }

  async cancelPopup() {
    pageFixture.page('dialog', dialog => dialog.dismiss());
  }

  /**
   * Handles the logic for navigating through the upload process when the upload involves a pop up file browser
   *  Fills the file browser with the full path to a given file instead of having to navigate clicks
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async uploadFile(selector,selectValue) {
    await this.waitForSelector(selector)
    const uploadPath = `${process.env.UPLOADS_PATH}${selectValue}`;
    const fileInput = await pageFixture.page.locator(selector);
    await fileInput.setInputFiles(uploadPath);
    // await this.fillFormField(selector,uploadPath);
  }

  /**
   * Handles the logic for waiting for an element to be visible on the page
   *  *** This is for HIDDEN vs VISIBLE properties that are on DOM elements ***
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async waitForElementVisible(selector) {
    await pageFixture.page.waitForSelector(selector,{state:'visible'});
  }

  /**
   * Handles the logic for waiting for an element to be visible on the page
   *  *** This is for VISIBLE vs HIDDEN properties that are on DOM elements ***
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   */
  async waitForElementHidden(selector) {
    await pageFixture.page.waitForSelector(selector,{state:'hidden'});
  }

    /**
   * Handles the logic for taking a screenshot at any given moment this function is called
   *  **** THE PLAYWRIGHT HOOKS ALREADY DO THIS AUTOMATICALLY ON FAILURE ****
   *   *** ONLY USE THIS IF YOU NEED SPECIFIC USE CASE SCREENSHOTS ***
   * @param {string} filename -> represents the path to a given file
   */
  async takeScreenshot(fileName) {
    await pageFixture.page.screenshot({path:fileName});
  }

    /**
   * Handles the logic for waiting for a selector to be available on the page
   *  **** THIS HAPPENS NATIVELY ON PLAYWRIGHT, BUT SOMETIMES YOU WANT CONTROL OF HOW LONG IT WAITS ****
   * Takes in a DOM selector in string format
   * @param {string} selector -> represents any of the following below DOM locators
   *                            ID,Class,CSS,XPATH, etc.
   * @param {int} time -> time value in milliseconds
   */
  async waitForSelector(selector,time) {
    if(!time) {
      time = 30000;
    }
    await pageFixture.page.waitForSelector(selector,{timeout:time});
  }

  /**
   * Handles the logic that mimics sleeps in other languages
   *  Waits for a period of time before continuing with other functions
   * @param {int} time -> time value in milliseconds
   */
  async wait(time) {
    if(time) {
    await pageFixture.page.waitForTimeout(time);
    } else {
      await pageFixture.page.waitForTimeout(1000);
    }
  }

  /**
   * Helper function that checks if a webelement object is an input
   * @param {object} element -> represents a WebElement object
   */
  async isInput(element) {
    const tagName = await element.evaluate((ele) => ele.tagName);
    if(tagName.toLowerCase() === 'input') {
      return true;
    }
    return false;
  }

  async isDate(element) {
    if(await element.evaluate((ele) => ele.type == 'date')) {
      return true
    }
    return false;
  }
 
  async verifyAscendedTable(page, tableSelector, columnIndex) {
    const rows = await page.$$(tableSelector + '/tbody/tr');
  
    for (let i = 0; i < rows.length - 1; i++) {
      const cells = await rows[i].$$('td');
      const currentCellText = await cells[columnIndex].innerText();
      if(!currentCellText.includes("\n")) {
        continue;
      }
      const nextRowCells = await (await rows[i + 1].$$('td'));
      const nextCellText = await nextRowCells[columnIndex].innerText();
      if (currentCellText.localeCompare(nextCellText, 'en', { sensitivity: 'base' }) > 0) {
          return false;
      }
    }
  
    return true;
  }

  async verifyDescendedTable(page, tableSelector, columnIndex) {
    const rows = await page.$$(tableSelector + '/tbody/tr');
  
    for (let i = 0; i < rows.length - 1; i++) {
        const cells = await rows[i].$$('td');
        const currentCellText = await cells[columnIndex].innerText();
        if(!currentCellText.includes("\n")) {
          continue;
        }
        const nextRowCells = await (await rows[i + 1].$$('td'));
        const nextCellText = await nextRowCells[columnIndex].innerText();
        if (currentCellText.localeCompare(nextCellText, 'en', { sensitivity: 'base' }) < 0) {
            return false;
        }
    }
  
    return true;
  }

};
