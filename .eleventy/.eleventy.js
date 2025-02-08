module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("../posts/**/*.png");
  eleventyConfig.addPassthroughCopy("../posts/**/*.jpg");
  eleventyConfig.addPassthroughCopy("assets");

  return {
    markdownTemplateEngine: false, // Disable Liquid/Nunjucks processing in Markdown
    htmlTemplateEngine: "liquid",    // Still process your layouts as Liquid
    dir: {
      input: "../posts",           // from .eleventy folder, go up to posts
      includes: "../.eleventy/_includes",
      layouts: "../.eleventy/_layouts",
      output: "../_site"
    }
  };
};
