const glob = require('glob');
const yamlMerge = require('yaml-merge');
const sleep = require('system-sleep');

let xpath;

class Page {
    getElements(elementId) {
        function objectCollector() {
            glob('tests/wdio/locators/*.yml', function (er, files) {
                if (er) throw er;
                xpath = yamlMerge.mergeFiles(files);
            });
            do {
                sleep(10);
            } while (xpath === undefined);
            return xpath;
        }

        objectCollector();
        return xpath[elementId];
    }
}

module.exports = new Page();
