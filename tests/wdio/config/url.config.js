module.exports = {
    getUrls: function (env) {
        if (env === 'TEST') {
            return {
                dummy: 'http://testing-ground.scraping.pro/login',
                dummyTest: 'http://testing-ground.scraping.pro/login',
            };
        } else if (env === 'test02') {
            return {
                dummyTest: 'http://testing-ground.scraping.pro/login',
            };
        }
    }
};
