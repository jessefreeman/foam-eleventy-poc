const CleanCSS = require("clean-css");
const postcss = require("postcss");
const precss = require("precss");

module.exports = function(eleventyConfig) {
  // Add custom filters
  eleventyConfig.addFilter("date", require("./filters/dates.js"));

  // Custom `map` filter to map a specific property in objects
  eleventyConfig.addFilter("map", function(array, property) {
    return array.map(item => item[property]);
  });
  
  // Custom `flatten` filter to flatten nested arrays
  eleventyConfig.addFilter("flatten", function(array) {
    return array.flat();
  });

  // Custom `unique` filter to remove duplicates
  eleventyConfig.addFilter("unique", function(array) {
    return [...new Set(array)];
  });

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
