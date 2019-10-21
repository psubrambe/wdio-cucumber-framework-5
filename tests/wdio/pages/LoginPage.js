const Actions = require('./common/Actions');
let importUrl = require('../config/url.config');
let config = require('../config/wdio.conf');

let userAccount;
let userBrand;

class LoginPage {

    openPage(brand) {
        try {
            // eslint-disable-next-line global-require
            userAccount = require('../testData/userAccount_TEST.json');
            userBrand = brand;
            userAccount = userAccount[brand];
        } catch (e) {
            throw new Error('Data file not found for provided environment(' + config.config.environment.toUpperCase() + ')');
        }
        let url = importUrl.getUrls(config.config.environment);
        Actions.url(url[brand]);
    }

    loginWith(userType) {
        userAccount = userAccount[userType];
        if(userAccount === undefined) {
            throw new Error(`Data type ${userType} not present.`);
        }
        Actions.accountCredentials(userAccount.userName, userAccount.password, userBrand);
        Actions.setValue('userName_txtbox', userAccount.userName);
        Actions.setValue('password_txtbox', userAccount.password);
        Actions.click('continue_btn');
    }
    goback() {
        Actions.click('back');
    }
}

module.exports = LoginPage;
