const { src, dest, parallel, task, watch, series } = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const changed = require("gulp-changed");
const babel = require("gulp-babel");
const livereload = require("gulp-livereload");

task("images", function() {
	return src("images/**")
		.pipe(changed("assets")) // ignore unchanged files
		.pipe(dest("assets"));
});

task("sass", function() {
	return src("styles/**/*.scss")
		.pipe(concat("theme.css"))
		.pipe(sass())
		.pipe(dest("assets"));
});

task("js", function() {
	return src("scripts/**/*.js")
		.pipe(
			babel({
				presets: ["@babel/env"]
			})
		)
		.pipe(concat("theme.js"))
		.pipe(dest("assets"));
});

task("watch", function() {
	livereload.listen();
	watch("styles/**/*.scss", series("sass"));
	watch("scripts/**/*.js", series("js"));
});

// task("default", ["sass", "js", "images"]);
