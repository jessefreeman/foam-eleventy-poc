const gulp = require("gulp");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/*
  Delete the _site folder
*/
gulp.task("clean", function (cb) {
  const sitePath = path.resolve(__dirname, "_site");
  if (fs.existsSync(sitePath)) {
    fs.rmSync(sitePath, { recursive: true, force: true });
    console.log("_site folder deleted.");
  }
  cb();
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
  gulp.watch('/workspace/notes/**/*.md', gulp.series("eleventy"));
});

/*
  Build task
*/
gulp.task("build", gulp.series(
  "clean",  // Clean the _site folder first
  "eleventy" // Then run Eleventy
));
