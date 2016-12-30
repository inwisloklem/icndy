"use strict";

var gulp = require("gulp");

var jade = require("gulp-jade");
var plumber = require("gulp-plumber");
var prettify = require('gulp-html-prettify');
var sass = require("gulp-sass");
var server = require("browser-sync").create();

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
