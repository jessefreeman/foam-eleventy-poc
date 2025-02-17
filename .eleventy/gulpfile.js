const gulp = require("gulp");
const postcss = require("gulp-postcss");
const precss = require("precss");
const cssnano = require("cssnano");
const { exec } = require("child_process");
const path = require("path");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

// CSS task: process CSS files located in site/_includes/css
gulp.task("css", function () {
  return gulp.src("site/_includes/css/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }, (details) => {
      console.log(`${details.name}: Original: ${details.stats.originalSize} bytes, Minified: ${details.stats.minifiedSize} bytes`);
    }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("_site/css"))
    .on("end", () => console.log("CSS minification complete."));
});

// Eleventy task: rebuild the site
gulp.task("eleventy", function (cb) {
  exec("npx eleventy", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

// Watch task: watch for changes in CSS and markdown files
gulp.task("watch", function () {
  gulp.watch("site/_includes/css/**/*.css", gulp.series("css"));
  gulp.watch("/workspace/notes/**/*.md", gulp.series("eleventy"));
});

// Build task: run CSS then Eleventy
gulp.task("build", gulp.series("eleventy", "css"));

// Serve task: start the live-reload server (server.js should be in the same folder)
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

// Watch-and-serve task: build first, then run serve and watch in parallel
gulp.task("watch-and-serve", gulp.series("build", gulp.parallel("serve", "watch")));
