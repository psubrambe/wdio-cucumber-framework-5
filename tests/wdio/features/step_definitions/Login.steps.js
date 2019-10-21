let {Given, When, Then} = require('cucumber');

const LoginPage = require('../../pages/LoginPage');

const loginPage = new LoginPage();

Given(/^I login as "([^"]*)" user for "([^"]*)" brand$/, function (userType, brand) {
    loginPage.openPage(brand);
    loginPage.loginWith(userType);
});

When(/^I do logout$/, function () {
    loginPage.goback()
});
