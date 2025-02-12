module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("formatDate", date =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  );

  // Custom `map` filter to map a specific property in objects
  eleventyConfig.addFilter("map", function(array, property) {
    return array.map(item => item[property]);
  });
  
  eleventyConfig.addPassthroughCopy({
    "site/_includes/css/styles.css": "css/styles.css"
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
  const pathPrefix = "/@jessefreeman/foam-eleventy-mvp.main/apps/code-server/proxy/8081";
  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);

  return {
    dir: {
      input: "site",
      output: "_site",
      data: "_data"
    }
  };
};
