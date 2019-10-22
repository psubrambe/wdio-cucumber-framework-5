const faker = require('faker');
const assert = require('assert');
const Page = require('../common/Page');

let userDetails = {};

class Actions {

    url(url) {
        return browser.url(url);
    }

    setValue(locator, value) {
        locator = Page.getElements(locator);
        if (value === 'password') {
            $(locator).waitForDisplayed(50000, false, 'Element ' + locator + ' not found');
            return $(locator).setValue(userDetails.password);
        } else {
            $(locator).waitForDisplayed(50000, false, 'Element ' + locator + ' not found');
            return $(locator).setValue(value);
        }
    }

    click(locator) {
        locator = Page.getElements(locator);
        let cookie = Page.getElements('cookies_Concern');
        if ($(cookie).isDisplayed()) {
            $(cookie).waitForDisplayed(50000, false, 'Element Cookie Concern ' + locator + ' not found');
            $(cookie).click();
            $(locator).scrollIntoView();
            return $(locator).click();
        } else {
            try {
                $(locator).waitForDisplayed(50000, false, 'Element ' + locator + ' not found');
                return $(locator).click();
            } catch (e) {
                if ($(cookie).isDisplayed()) {
                    $(cookie).waitForDisplayed(20000, false, 'Element Cookie Concern' + locator + ' not found');
                    $(cookie).click();
                    $(locator).waitForDisplayed(3000, false, 'Element ' + locator + ' not found');
                    $(locator).scrollIntoView();
                    return $(locator).click();
                } else {
                    $(locator).waitForDisplayed(3000, false, 'Element ' + locator + ' not found');
                    return $(locator).click();
                }
            }
        }
    }

    pause(seconds) {
        return browser.pause(seconds * 1000);
    }

    getUrl() {
        return browser.getUrl();
    }

    refresh() {
        return browser.refresh();
    }

    accountCredentials(username, password, brand) {
        userDetails['username'] = username;
        userDetails['password'] = password;
        userDetails['brand'] = brand;
    }
    
    getUserDetail() {
        return userDetails;
    }

    waitUntil(locator, attribute, value) {
        locator = Page.getElements(locator);
        return browser.waitUntil(() => {
            return $(locator).getAttribute(attribute) === value;
        }, 7000, 'Expected element not available after 7s');
    }
}

module.exports = new Actions();
