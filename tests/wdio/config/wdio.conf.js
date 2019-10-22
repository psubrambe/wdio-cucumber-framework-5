const os = require('os');
const cucumberJson = require('wdio-cucumberjs-json-reporter').default;
const {generate} = require('multiple-cucumber-html-reporter');
const {removeSync} = require('fs-extra');

let importFunction = require('./import');

let featureFilePath;

let argv = require('yargs')
    .usage('Usage: gulp cucumber --[options]')
    .options({
        browser: {
            alias: 'browser',
            describe: 'Specify the browser',
            default: 'chrome'
        },
        env: {
            alias: 'environment',
            describe: 'Specify the environment',
            default: 'test'
        },
        channel: {
            alias: 'channel',
            describe: 'Specify the channel',
            default: 'desktop'
        },
        pack: {
            alias: 'pack',
            describe: 'Specify the pack',
            default: 'platinum'
        },
        tags: {
            alias: 'tags',
            describe: 'Specify the tag'
        },
        ff: {
            alias: 'ff',
            describe: 'Specify the feature file name'
        },
        hostname: {
            alias: 'hostname',
            describe: 'Grid Host',
            default: '127.0.0.1'
        },
        port: {
            alias: 'port',
            describe: 'Grid Port',
            default: 4444
        },
        runner: {
            alias: 'runner',
            describe: 'Runner Type',
            default: 'local'
        },
        maxInstances: {
            alias: 'maxInstances',
            describe: 'Specify the number of instance',
            default: 1
        },
        failBuildOnFirstFailure: {
            alias: 'failBuildOnFirstFailure',
            describe: 'Fail Build On First Test Failure',
            default: false
        },
        // proxyAddress: {
        //     alias: 'proxyAddress',
        //     describe: 'NTLM Proxy Address'
        // },
        enableReportPortal: {
            alias: 'enableReportPortal',
            describe: 'Enable Report Portal Log',
            default: false
        },
        jobDetails: {
            alias: 'jobDetails',
            describe: 'Jenkins Build Number'
        }
    })
    .argv;

if (argv.ff && argv.ff !== true) {
    if (argv.ff !== '**') {
        featureFilePath = 'tests/wdio/features/e2e/' + argv.channel + '/' + argv.pack + '/' + argv.ff + '.feature';
    } else {
        featureFilePath = 'tests/wdio/features/e2e/' + argv.channel + '/' + argv.pack + '/**';
    }
} else {
    if (argv.pack && argv.pack !== true) {
        featureFilePath = 'tests/wdio/features/e2e/' + argv.channel + '/' + argv.pack + '/**';
    } else {
        featureFilePath = 'tests/wdio/features/e2e/' + argv.channel + '/**';
    }
}

function getCapabilities() {
    let capabilitiesArray = [];
    let deviceName,
        deviceType;
    if (os.type() === 'Darwin') {
        deviceName = 'Mac OS';
        deviceType = 'osx';
    }
    if (os.type() === 'win32' || os.type() === 'win64') {
        deviceName = 'Windows';
        deviceType = 'windows';
    }
    if (os.type() === 'Linux' || os.type() === 'linux') {
        deviceName = 'Linux';
        deviceType = 'linux';
    }
    if (argv.runner === 'Jenkins') {
        let returnObj = {
            browserName: argv.browser,
            'cjson:metadata': {
                browser: {
                    name: argv.browser,
                    version: '58',
                },
                device: deviceName,
                platform: {
                    name: deviceType,
                    version: os.release()
                }
            },
            proxy: {
                proxyType: 'manual',
                httpProxy: argv.proxyAddress,
                sslProxy: argv.proxyAddress,
                noProxy: noProxyUrl
            }
        };
        capabilitiesArray.push(returnObj);
    } else {
        let returnObject = {
            browserName: argv.browser,
            'cjson:metadata': {
                browser: {
                    name: argv.browser,
                    version: '58',
                },
                device: deviceName,
                platform: {
                    name: deviceType,
                    version: os.release()
                }
            }
        };
        capabilitiesArray.push(returnObject);
    }
    return capabilitiesArray;
}

let config = {
    environment: argv.env,
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',
    //
    // =====================
    // Server Configurations
    // =====================
    // Host address of the running Selenium server. This information is usually obsolete as
    // WebdriverIO automatically connects to localhost. Also, if you are using one of the
    // supported cloud services like Sauce Labs, Browserstack, or Testing Bot you don't
    // need to define host and port information because WebdriverIO can figure that out
    // according to your user and key information. However, if you are using a private Selenium
    // backend you should define the host address, port, and path here.
    //
    hostname: argv.hostname,
    port: argv.port,
    path: '/wd/hub',
    //
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: [
        featureFilePath
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: argv.maxInstances,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: getCapabilities(),
    // capabilities: [{
    //     // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    //     // grid with only 5 firefox instances available you can make sure that not more than
    //     // 5 instances get started at a time.
    //     maxInstances: 5,
    //     //
    //     browserName: 'chrome',
    //     // If outputDir is provided WebdriverIO can capture driver session logs
    //     // it is possible to configure which logTypes to include/exclude.
    //     // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
    //     // excludeDriverLogs: ['bugreport', 'server'],
    // }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'silent',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    // bail: bailCount,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'http://localhost',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 50000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter.html
    //
    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        require: importFunction.parseSteps(),        // <string[]> (file/dir) require files before executing features
        backtrace: false,   // <boolean> show full backtrace for errors
        requireModule: [],  // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        dryRun: false,      // <boolean> invoke formatters without executing steps
        //failFast: fastFail,    // <boolean> abort the run on first failure
        format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        colors: true,       // <boolean> disable colors in formatter output
        snippets: true,     // <boolean> hide step definition snippets for pending steps
        source: true,       // <boolean> hide source uris
        profile: [],        // <string[]> (name) specify the profile to use
        strict: false,      // <boolean> fail if there are any undefined or pending steps
        tagExpression: argv.tags,           // <string[]> (expression) only execute the features or scenarios with tags matching the expression
        timeout: 360000,     // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // eslint-disable-next-line no-unused-vars
    onPrepare: function (config, capabilities) {
        removeSync('tests/wdio/report/json/');
        removeSync('tests/wdio/report/html/');
        // eslint-disable-next-line no-console
        console.log('******** Execution Begins ********');
    },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // eslint-disable-next-line no-unused-vars
    before: function (capabilities, specs) {
        browser.setWindowSize(1440, 1200);
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Runs before a Cucumber feature
     * @param {Object} feature feature details
     */
    // beforeFeature: function (uri, feature) {
    // },
    /**
     * Runs before a Cucumber scenario
     * @param {Object} scenario scenario details
     */
    // beforeScenario: function (uri, feature, scenario) {
    // },
    /**
     * Runs before a Cucumber step
     * @param {Object} step step details
     */
    // beforeStep: function (uri, feature, scenario, step) {
    // },
    /**
     * Runs after a Cucumber step
     * @param {Object} stepResult step result
     */
    // afterStep: function (uri, feature, scenario, step) {
    // },
    /**
     * Runs after a Cucumber scenario
     * @param {Object} scenario scenario details
     */
    // afterScenario: function (uri, feature, scenario) {
    // },
    /**
     * Runs after a Cucumber feature
     * @param {Object} feature feature details
     */
    // afterFeature: function (uri, feature) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: function (exitCode, config, capabilities, results) {
        // eslint-disable-next-line no-console
        console.log(results);
        // eslint-disable-next-line no-console
        console.log('******** Execution Ends ********');
        generate({
            jsonDir: 'tests/wdio/report/json',
            reportPath: 'tests/wdio/report/html',
            openReportInBrowser: true,
            disableLog: true
        });
    },
    /**
     * Gets executed when a refresh happens.
     * @param {String} oldSessionId session ID of the old session
     * @param {String} newSessionId session ID of the new session
     */
    //onReload: function(oldSessionId, newSessionId) {
    //}
};
// if (argv.runner === 'sauce') {
//     config.services = ['sauce'];
//     config.user = 'dajgd.dkahdfk';
//     config.key = 'teayzygy-7b97-4376-97df-6a511d23bc86';
//     config.region = 'lu';
//     config.protocol = 'http';
// }

if (argv.enableReportPortal) {
    config.services = [[RpService, {}]];
    config.reporters = ['spec', ['cucumberjs-json', {jsonFolder: 'tests/wdio/report/json/'}], [reportportal, getPortalConfig()]];
    // eslint-disable-next-line no-unused-vars
    config.afterScenario = function (uri, feature, scenario, result, sourceLocation) {
        if (result.status === 'failed') {
            const screenShot = global.browser.takeScreenshot();
            // let attachment = Buffer.from(screenShot, 'base64');
            // reportportal.sendFileToTest(failureObject, 'error', 'screnshot.png', attachment);
            return cucumberJson.attach(screenShot, 'image/png');
        }
    };
} else {
    config.reporters = ['spec', ['cucumberjs-json', {jsonFolder: 'tests/wdio/report/json/'}]];
    // eslint-disable-next-line no-unused-vars
    config.afterScenario = function (uri, feature, scenario, result, sourceLocation) {
        if (result.status === 'failed') {
            const screenShot = global.browser.takeScreenshot();
            return cucumberJson.attach(screenShot, 'image/png');
        }
    };
}

exports.config = config;
