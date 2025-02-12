const gulp = require("gulp");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass")(require("sass"));
const precss = require('precss');
const cssnano = require('cssnano');
const { exec } = require("child_process");

/*
  Generate the CSS with PostCSS
*/
gulp.task('scss', function () {
  return gulp.src('css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([cssnano]))
    .pipe(gulp.dest('site/_includes/css'));
});

/*
  Rebuild Eleventy when markdown files change
*/
gulp.task("eleventy", function (cb) {
  exec("npx eleventy", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/*
  Watch folders for changes
*/
gulp.task("watch", function() {
  gulp.watch('css/**/*.scss', gulp.parallel('scss'));
  gulp.watch('/workspace/notes/**/*.md', gulp.series('eleventy'));
});

/*
  Build task
*/
gulp.task('build', gulp.series(
  'scss',
  'eleventy'
));
