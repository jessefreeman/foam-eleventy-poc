const CleanCSS = require("clean-css");
const postcss = require('postcss')
const precss = require('precss')

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("date", require("./filters/dates.js") );

  return {
    dir: {
      pathPrefix: "/@jessefreeman/foam-eleventy-mvp.main/apps/code-server/proxy/8080",
      input: "site",
      output: "_site",
      data: "_data"
    },
    feed: process.env.MEDIUM_FEED ||'https://medium.com/feed/netlify'
  };

};
