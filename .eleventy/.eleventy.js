module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("../posts/**/*.png");
  eleventyConfig.addPassthroughCopy("../posts/**/*.jpg");
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: "../posts",           // from .eleventy folder, go up to posts
      includes: "../.eleventy/_includes",
      layouts: "../.eleventy/_layouts",
      output: "../_site"
    }
  };
};
