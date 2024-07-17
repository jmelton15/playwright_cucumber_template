const { expect } = require('@playwright/test');
const {pageFixture} = require("../../../hooks/pageFixture");
const {BasePage} = require("../../BasePage")

exports.Connect4MainPage = class Connect4MainPage {

    constructor() {
        this.page = pageFixture.page;
        this.BasePage = new BasePage();
    }
//////////////////////////////////////////////////////////////////////////////////

    // LOCATORS //
    
    url = process.env.CONNECT4_BASE_URL || 'http://localhost:3000'
    mainHeader = '//html/body/div[1]/h1'
    playerOneHeader = "#list-div-1 > h2"
    playerOneImage = "#list-div-1 > div"
    playerOneSelectbox = "#list-div-1 > select"

//////////////////////////////////////////////////////////////////////////////////

    // TEST METHODS //

    async goToUrl() {
        await this.BasePage.navigateTo(this.url)
    }

    async verifyMainHeaderText(headerText) {
        await this.BasePage.verifyText(this.mainHeader,headerText)
    }

    async verifyTokenImage(imgUrl) {
        await this.BasePage.verifyBackgroundImage(this.playerOneImage,imgUrl)
    }

    async selectNewToken(tokenIndex) {
        await this.BasePage.selectUsingIndex(this.playerOneSelectbox,tokenIndex)
    }

    async selectNewTokenAndVerify(tokenIndex) {
        await this.BasePage.selectUsingIndex(this.playerOneSelectbox,tokenIndex)
        let imgUrl = "";
        switch(tokenIndex) {
            case(1):
                imgUrl = 'url("css/Images/YellowPiece.png")'
                break;
            case(2):
                imgUrl = 'url("css/Images/RedPiece.png")'
                break;
        }
        await this.verifyTokenImage(imgUrl);
    }
}