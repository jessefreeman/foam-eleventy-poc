const gulp = require("gulp");
const postcss = require("gulp-postcss");
const precss = require('precss');
const cssnano = require('cssnano');
const { exec } = require("child_process");

/*
  Generate the CSS with PostCSS
*/
gulp.task('css', function () {
  return gulp.src('css/**/*.css')
    .pipe(postcss([precss, cssnano]))
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
  gulp.watch('css/**/*.css', gulp.parallel('css'));
  gulp.watch('/workspace/notes/**/*.md', gulp.series('eleventy'));
});

/*
  Build task
*/
gulp.task('build', gulp.series(
  'css',
  'eleventy'
));
