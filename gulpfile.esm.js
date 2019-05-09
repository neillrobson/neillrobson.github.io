import BS from 'browser-sync';
import cp from 'child_process';
import fs from 'fs-extra';
import gulp from 'gulp';
import sass from 'gulp-sass';
import node_sass from 'node-sass';

const browsersync = BS.create();

sass.compiler = node_sass;

function bsInit(done) {
    browsersync.init({
        server: {
            baseDir: './_site'
        },
        port: 3000
    });
    done();
}

function bsReload(done) {
    browsersync.reload();
    done();
}

function clean() {
    return fs.emptyDir('./_site');
}

function css() {
    return gulp
        .src("./_sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./_site/assets/css"))
        .pipe(browsersync.stream());
}

function jekyll() {
    return cp.spawn("bundle.bat", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

function watchFiles() {
    gulp.watch("./_sass/**/*", css);
    gulp.watch([
        "./_includes/**/*",
        "./_pages/**/*",
        "./_posts/**/*",
        "./_projects/**/*",
        "./_layouts/**/*",
        "./_drafts/**/*",
    ], gulp.series(jekyll, bsReload));
}

const build = gulp.series(clean, gulp.parallel(css, jekyll));
const watch = gulp.parallel(bsInit, watchFiles);

export {
    build,
    watch
};
export default build;