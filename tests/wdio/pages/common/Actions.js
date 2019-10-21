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
        if (value === 'randomName') {
            let randomName = faker.name.firstName();
            if (randomName.includes('\'')) {
                randomName = randomName.replace(/\'/g, '');
            }
            let lastName = faker.name.lastName();
            if (lastName.includes('\'')) {
                lastName = lastName.replace(/\'/g, '');
            }
            let value = randomName + lastName;
            if (value.length > 20) {
                value = value.substring(0, 15);
            }
            $(locator).waitForDisplayed(50000, false, 'Element ' + locator + ' not found');
            return $(locator).setValue(value);
        } else if (value === 'password') {
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

    isExisting(locator) {
        locator = Page.getElements(locator);
        return $(locator).isExisting();
    }

    getText(locator) {
        locator = Page.getElements(locator);
        $(locator).waitForDisplayed(50000, false, 'Element ' + locator + ' not found');
        return $(locator).getText();
    }

    selectByAttribute(locator, attribute, value) {
        locator = Page.getElements(locator);
        $(locator).waitForDisplayed(50000, false, 'Element ' + locator + ' not found');
        return $(locator).selectByAttribute(attribute, value);
    }

    getUrl() {
        return browser.getUrl();
    }

    isVisible(locator) {
        locator = Page.getElements(locator);
        $(locator).waitForDisplayed(50000, false, 'Element ' + locator + ' not found');
        let value = $(locator).isExisting();
        if (value) {
            return assert.equal(value, true, 'Element Present');
        } else {
            return assert.equal(value, true, 'Unable to locate element');
        }
    }

    refresh() {
        return browser.refresh();
    }

    waitForExist(locator) {
        locator = Page.getElements(locator);
        return $(locator).waitForExist(50000, false, 'Element ' + locator + ' not found');
    }

    accountCredentials(username, password, brand) {
        userDetails['username'] = username;
        userDetails['password'] = password;
        userDetails['brand'] = brand;
    }

    getAttribute(attribute, locator) {
        locator = Page.getElements(locator);
        return $(locator).getAttribute(attribute);
    }

    selectByVisibleText(locator, value) {
        locator = Page.getElements(locator);
        return $(locator).selectByVisibleText(value);
    }

    selectByIndex(locator, index) {
        locator = Page.getElements(locator);
        return $(locator).selectByIndex(index);
    }

    getUserDetail() {
        return userDetails;
    }

    clearValue(locator) {
        locator = Page.getElements(locator);
        return $(locator).clearValue();
    }

    isEnabled(locator) {
        locator = Page.getElements(locator);
        return $(locator).isEnabled();
    }

    waitForEnabled(locator) {
        locator = Page.getElements(locator);
        return $(locator).waitForEnabled(20000, false, 'Unable to perform action as element is not enabled');
    }

    waitForDisappear(locator) {
        locator = Page.getElements(locator);
        return $(locator).waitForDisplayed(320000, true, 'Element ' + locator + ' still located in page');
    }

    scroll(locator) {
        locator = Page.getElements(locator);
        return $(locator).scrollIntoView();
    }

    waitUntil(locator, attribute, value) {
        locator = Page.getElements(locator);
        return browser.waitUntil(() => {
            return $(locator).getAttribute(attribute) === value;
        }, 7000, 'Expected element not available after 7s');
    }
}

module.exports = new Actions();
