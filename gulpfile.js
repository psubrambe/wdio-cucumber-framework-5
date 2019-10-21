const gulp = require('gulp');
const path = require('path');
const resolve = require('resolve');

let Launcher = require(path.join(path.dirname(resolve.sync('@wdio/cli')), 'launcher.js')).default;

gulp.task('cucumber', (done) => {
    let wdio = new Launcher('tests/wdio/config/wdio.conf.js', {});
    wdio.run().then(function (code, err) {
        process.stdin.pause();
        if (code !== 0) {
            // eslint-disable-next-line no-console
            console.log('wdio exited with code ' + code);
            done();
            process.exit(1);
        }
        if (err) {
            // eslint-disable-next-line no-console
            console.log('wdio exited due to err ' + err);
            done();
            process.exit(1);
        }
        if (code === 0) {
            done();
            process.exit(0);
        }
    });
});
