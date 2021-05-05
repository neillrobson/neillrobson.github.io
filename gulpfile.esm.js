import BS from 'browser-sync';
import cp from 'child_process';
import flatten from 'gulp-flatten';
import fs from 'fs-extra';
import gulp from 'gulp';
import path from 'path';
import sass from 'gulp-dart-sass';
import node_sass_tilde_importer from 'node-sass-tilde-importer';

const pluginFiles = {
    'jquery/dist/jquery.min.js': '.',
    'popper.js/dist/umd/popper.min.js': '.',
    'popper.js/dist/umd/popper.min.js.map': '.',
    'bootstrap/dist/js/*': 'bootstrap/js',
    'flickity/dist/*.min.*': 'flickity',
    '@fortawesome/fontawesome-free/js/all.min.js': 'fontawesome',
    'imagesloaded/imagesloaded.pkgd.min.js': '.',
    'isotope-layout/dist/isotope.pkgd.min.js': '.',
    'highlightjs/highlight.pack.min.js': 'highlight',
    'highlightjs/styles/*': 'highlight/styles',
    'jquery-validation/dist/jquery.validate.min.js': 'jquery-validation'
};

const browsersync = BS.create();

function bsInit(done) {
    browsersync.init({
        server: {
            baseDir: './_site'
        },
        port: 3000
    }, (err, bs) => {
        bs.addMiddleware("*", (req, res) => {
            const content_404 = fs.readFileSync(path.join(__dirname, '_site/404.html'));
            res.write(content_404);
            res.end();
        });
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

function compileSass() {
    return gulp
        .src("./src/_sass/*.scss")
        .pipe(sass({
            importer: node_sass_tilde_importer
        }))
        .pipe(gulp.dest("./_site/assets/css"))
        .pipe(browsersync.stream());
}

function copyJs(src, dest) {
    return gulp
        .src(path.join('./node_modules', src))
        .pipe(flatten())
        .pipe(gulp.dest(path.join('./_site/assets/plugins', dest)))
        .pipe(browsersync.stream());
}

function copyFonts() {
    return gulp
        .src("./node_modules/@fortawesome/fontawesome-free/webfonts/*")
        .pipe(gulp.dest("./_site/assets/webfonts"))
        .pipe(browsersync.stream());
}

const loadPluginJs = gulp.parallel.apply(
    null, Object.entries(pluginFiles).map(e => copyJs.bind(null, ...e)));

function jekyll() {
    let bundle = process.platform === 'win32' ? "bundle.bat" : "bundle";
    let args = ["exec", "jekyll", "build"];
    if (-1 < process.argv.indexOf("--drafts"))
        args.push("--drafts");
    return cp.spawn(bundle, args, { stdio: "inherit" });
}

function watchFiles() {
    gulp.watch("./src/_sass/**/*", compileSass);
    gulp.watch("./node_modules/**/*", gulp.parallel(loadPluginJs, copyFonts));
    gulp.watch("./src/**/*", gulp.series(jekyll, bsReload));
}

const build = gulp.series(clean, gulp.parallel(compileSass, copyFonts, loadPluginJs), jekyll);
const watch = gulp.series(build, gulp.parallel(bsInit, watchFiles));

export {
    build,
    watch
};
export default build;
