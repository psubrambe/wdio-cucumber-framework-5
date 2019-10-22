
This repository contains automated integration tests web apps.  
  
The tests are run against different browsers (either through selenium or zalenium).  
  
## *Requirements*  
  
* Git.  
* [Node.js](https://nodejs.org/) == 10.15.0  
* Java 8 or higher    
* Webstorm (or whatever IDE you're comfortable with).  
* This project is routinely tested on so instructions for installing  
  on these machines are as below.  
  
## *Setup*  
  
1. Open a terminal.  
2. Clone the repo .  
3. Navigate to the repository folder.  
4. Install all the npm dependencies `npm i`.  
  
## *Running tests*  
  
`gulp cucumber --browser chrome --env TEST`  
  
## *Command line arguments*  
* `--browser` - mention the browser on which tests needs to be executed. `Default : chrome`  
* `--env` - mention the environment on which tests needs to be executed. `Default : TEST`  
* `--channel` - mention the channel on which tests needs to be executed. `Default : desktop`  
* `--pack`- mention the pack to run test. `Default : bronze`  
* `--tags` - mention the tag to run tests with given tag. `Default : 'not @Pending'`  
* `--ff` - mention the feature file name to run test.  
* `--hostname` - mention the hubHost on which test needs to run. `Default : 127.0.0.1`  
* `--port` - mention the hubPort on which test needs to run. `Default : 4444`  
* `--runner` - enable tests to run on Local / Jenkins / Saucelabs. `Default : local`  
* `--maxInstances` - specify number of parallel instance. `Default : 1`  
* `--failBuildOnFirstFailure` - make execution stop on first failure. `Default : false`  
* `--proxyAddress` - proxy address to run test on on-prem.  
* `--enableReportPortal` - enable report portal reports. `Default : false`  
* `--jobDetails` - specify job name for report portal.  
  
  
## *Writing new tests*  
  
1. Add a new .feature file for the story you are testing in the correct sub folder of `tests/wdio/features/e2e/`  
2. Name the feature (using `Feature:`) and add some Scenarios to your new .feature file  
3. You can add tags as you like to distinguish different groups of tests. Below is a list of tags and usage  
   * `@Sanity` used to run tests against Sanity.  
   * `@Gold` used to run gold pack tests.  
   * `@Generic_Reusable` , `@Generic_NonReusable` , `@Specific_Reusable` and `@Specific_NonReusable` are used to distinguish between tests based on data.  
4. Add step definitions for any undefined steps in `tests/wdio/features/step_definitions/`  
5. Add any undefined page objects in `tests/wdio/locators/`  
6. Run your tests locally before pushing your changes to source control.  
  
## *Code Style*  
  
Coding style is checked via `eslint` for js , `yaml-lint` for yml and `gherkin-lint` for feature files.  
  
## *Running lint*  
  
`npm run lint`  
  
## *Technologies*  
  
The following technologies form the core of the framework:  
  
* **WebdriverIO** `http://webdriver.io/` - WebDriver bindings for Node.js.   
* **Cucumber** `https://cucumber.io/` - Cucumber executes your .feature files, and those files contain executable specifications written in a language called Gherkin.  
* **Gulp** `https://gulpjs.com/` - Automate and enhance your workflow.  
* **Report Portal IO** `https://reportportal.io/` - AI-powered Test Automation Dashboard.  
* **Saucelabs** `https://saucelabs.com/` - Test your apps and websites across thousands of desktop and mobile browser/OS combinations in the cloud.  
  
## *Reporting*  
  
* **WDIO console** - `@wdio/spec-reporter`  
* **Report Portal** - `wdio-reportportal-reporter`  
* **Json Report** - `wdio-cucumberjs-json-reporter`  
* **HTML Report** - `multiple-cucumber-html-reporter`  
  
  
*License*  
----  
MIT
