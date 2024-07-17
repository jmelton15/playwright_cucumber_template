const {Given,When,Then} = require('@cucumber/cucumber');
const {expect} = require('@playwright/test');
const { pageFixture } = require('../../hooks/pageFixture');
const {Connect4MainPage} = require('../../pageObject/pages/Connect4App/mainpage')

const c4MP = new Connect4MainPage();

Given('Navigate to connect four App', async function() {
    await c4MP.goToUrl();
});

Then('Verify main header text is {string}', async function(str) {
    await c4MP.verifyMainHeaderText(str);
});

Then('Verify player one image url is', async function(docString) {
    await c4MP.verifyTokenImage(docString);
})

Then('Select Red Piece from token selectbox with select index {int}', async function(int) {
    await c4MP.selectNewToken(int)
})

Then('Verify player one image is now red piece', async function(docString) {
    await c4MP.verifyTokenImage(docString);
})