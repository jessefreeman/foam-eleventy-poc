const gulp = require("gulp");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

/*
  Clean the _site folder
*/
gulp.task("clean", function (cb) {
  const sitePath = path.resolve(__dirname, "_site");
  if (fs.existsSync(sitePath)) {
    fs.rmSync(sitePath, { recursive: true, force: true });
    console.log(`${sitePath} folder deleted.`);
  }
  cb();
});

/*
  Run Eleventy
*/
gulp.task("eleventy", function (cb) {
  exec("npx eleventy", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/*
  Copy and minify CSS from site/_includes/css to _site/css with a .min.css suffix
*/
gulp.task("css", function () {
  return gulp.src("site/_includes/css/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }, (details) => {
      console.log(`${details.name}: Original: ${details.stats.originalSize} bytes, Minified: ${details.stats.minifiedSize} bytes`);
    }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("_site/css"))
    .on("end", () => console.log("CSS minification complete."));
});

/*
  Build task: Clean, run Eleventy, then process CSS
*/
gulp.task("build", gulp.series("clean", "eleventy", "css"));

/*
  Watch for changes in markdown and CSS source files
*/
gulp.task("watch", function () {
  gulp.watch(`${config.paths.notes}/**/*.md`, gulp.series("build"));
  gulp.watch("site/_includes/css/*.css", gulp.series("build"));
});
