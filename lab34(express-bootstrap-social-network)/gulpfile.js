const {src, dest, parallel, watch, series} = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const del = require('del');

const paths = {
    styles: {
        src: 'public/stylesheets/*.less',
        dest: 'public/gulp/stylesheets/'
    },
    scripts: {
        src: 'public/javascripts/*.js',
        dest: 'public/gulp/javascripts/'
    },
    pages: {
        src: 'views/index.pug',
        dest: 'public/gulp/'
    },
    fonts: {
        src: 'public/stylesheets/fonts/**/*',
        dest: 'public/gulp/stylesheets/fonts/'
    },
    images: {
        src: 'public/images/static/**/*',
        dest: 'public/gulp/images/static/'
    }
}


function styles() {
    return src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(dest(paths.styles.dest));
}

function scripts() {
    return src(paths.scripts.src)
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(dest(paths.scripts.dest));
}

function pages() {
    return src(paths.pages.src)
        .pipe(pug({pretty: true, data: {title: 'МОЖНОWEB', subtitle: 'ВХОД'}}))
        .pipe(dest(paths.pages.dest))
}

function fonts() {
    return src(paths.fonts.src, {encoding: false})
        .pipe(dest(paths.fonts.dest));
}

function images() {
    return src(paths.images.src, {encoding: false})
        .pipe(dest(paths.images.dest));
}

function clean() {
    return del('./public/gulp/**', {force: true});
}

function watch_dev() {
    watch(paths.scripts.src, scripts);
    watch(paths.styles.src, styles);
    watch(paths.pages.src, pages);
}

exports.default = parallel(
    clean,
    styles,
    scripts,
    fonts,
    images,
    pages,
    watch_dev
);

exports.build = series(
    clean,
    styles,
    scripts,
    fonts,
    images,
    pages
);