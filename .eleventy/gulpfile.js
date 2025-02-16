const gulp = require("gulp");
const postcss = require("gulp-postcss");
const precss = require("precss");
const cssnano = require("cssnano");
const { exec } = require("child_process");
const path = require("path");

const WATCH_DIR = path.join(__dirname, "_site");

// Generate CSS with PostCSS
gulp.task("css", function () {
  return gulp
    .src("css/**/*.css")
    .pipe(postcss([precss, cssnano]))
    .pipe(gulp.dest("site/_includes/css"));
});

// Rebuild Eleventy when markdown files change
gulp.task("eleventy", function (cb) {
  exec("npx eleventy", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

// Watch files for changes
gulp.task("watch", function () {
  gulp.watch("css/**/*.css", gulp.series("css"));
  gulp.watch("/workspace/notes/**/*.md", gulp.series("eleventy"));
});

// Build everything
gulp.task("build", gulp.series("css", "eleventy"));

// Live-reload server task (runs server.js)
gulp.task("serve", function (cb) {
  const child = exec("node server.js", (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (err) cb(err);
  });
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  cb();
});

// Build first, then watch and serve
gulp.task("watch-and-serve", gulp.series("build", gulp.parallel("serve", "watch")));
