const CleanCSS = require("clean-css");
const postcss = require("postcss");
const precss = require("precss");

module.exports = function(eleventyConfig) {
  // Add custom filters
  eleventyConfig.addFilter("date", require("./filters/dates.js"));

  // Make pathPrefix available in templates
  const pathPrefix = "/@jessefreeman/foam-eleventy-mvp.main/apps/code-server/proxy/8080/";
  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);

  return {
    dir: {
      input: "site",
      output: "_site",
      data: "_data"
    },
    feed: process.env.MEDIUM_FEED || "https://medium.com/feed/netlify"
  };
};
