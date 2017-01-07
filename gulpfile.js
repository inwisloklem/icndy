"use strict";

var gulp = require("gulp");

var inject = require("gulp-inject");
var jade = require("gulp-jade");
var plumber = require("gulp-plumber");
var prettify = require('gulp-html-prettify');
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var server = require("browser-sync").create();
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");

gulp.task("serve", ["markup", "style"], function() {
  server.init({
    server: ".",
    notify: false,
    ui: false
  });

  gulp.watch("jade/**/*.jade", ["markup"]);
  gulp.watch("sass/**/*.sass", ["style"]);

  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("markup", function() {
  gulp.src("jade/**/*.jade")
    .pipe(plumber())
    .pipe(jade())
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(gulp.dest("."))
    .pipe(server.stream());
});

gulp.task("style", function() {
  gulp.src("sass/style.sass")
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("svgstore", function() {
  var svgs = gulp.src("img/icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp.src("jade/index.jade")
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(gulp.dest("jade"));
});
