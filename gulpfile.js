require('dotenv').config();
const { src, dest, parallel, task, watch, series } = require("gulp");
const browserify = require('browserify');
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const changed = require("gulp-changed");
const babel = require("gulp-babel");
const browserSync = require('browser-sync').create();
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const reactify = require('reactify');
const log = require('gulplog');
const glob = require('glob');

task("reload", function(done) {
    browserSync.reload();
    done();
})

task("serve", function(done) {
    browserSync.init({
        // server: true,
        // baseDir: './',
        proxy: process.env.SHOPIFY_STORE_NAME,
        reloadDelay: 2000,
        snippetOptions: {
            rule: {
                match: /<head[^>]*>/i,
                fn: function(snippet, match) {
                    return match + snippet;
                }
            }
        }
      });
      done();
})

task("images", function() {
	return src("images/**")
		.pipe(changed("assets")) // ignore unchanged files
		.pipe(dest("assets"));
});

task("sass", function() {
	return src("styles/**/*.scss")
		.pipe(concat("custom.css"))
		.pipe(sass())
		.pipe(dest("assets"));
});

task("js", function() {
    const files = glob.sync('scripts/**/*.js')

    var b = browserify({
        entries: files,
        transform: [reactify]
    });

    return b.bundle()
    .pipe(source('custom.js'))
    .pipe(buffer())
    .pipe(
        babel({
            presets: ["@babel/env"]
        })
    )
    .on('error', log.error)
	.pipe(dest("assets"));
});

task("watch", function() {
	watch("styles/**/*.scss", series("sass", "reload"));
    watch("scripts/**/*.js", series("js", "reload"));
    watch('images/*.{png,jpg,jpeg,gif,svg}', series("images", "reload"));
    watch("./**/*.liquid", series("reload"));
});

exports.default = series("sass", "js", "images", "serve", "watch");