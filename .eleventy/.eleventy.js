const config = require("./config");
const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const md = new markdownIt();

function copyReferencedImages(html, noteSourceDir, noteOutputDir) {
  const imageRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    if (!imgSrc.startsWith("http")) {
      const srcImage = path.join(noteSourceDir, imgSrc);
      const destImage = path.join(noteOutputDir, "images", path.basename(imgSrc));
      fs.mkdirSync(path.dirname(destImage), { recursive: true });
      try {
        fs.copyFileSync(srcImage, destImage);
        console.log(`Copied: ${srcImage} -> ${destImage}`);
      } catch (err) {
        console.error(`Failed to copy ${srcImage}:`, err);
      }
    }
  }
}

function getNotebook() {
  const notesDir = path.resolve(__dirname, config.paths.notes);
  const outputDir = path.resolve(__dirname, config.paths.output);
  const files = [];

  fs.readdirSync(notesDir).forEach((folderName) => {
    const folderPath = path.join(notesDir, folderName);
    if (fs.statSync(folderPath).isDirectory()) {
      fs.readdirSync(folderPath).forEach((file) => {
        if (file.endsWith(".md")) {
          files.push(path.join(folderPath, file));
        }
      });
    }
  });

  const notes = files
    .map((filePath) => {
      const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
      if (!data.tags || !data.tags.includes("public")) return null;
      const tags = ["all", ...data.tags.filter(tag => tag !== "public")];

      let dateString = "unknown";
      if (data.date) {
        const dateObj = new Date(data.date);
        if (!isNaN(dateObj)) {
          dateString = dateObj.toISOString().split("T")[0];
        }
      }

      const renderedHtml = md.render(content || "");

      // Copy images referenced in the note
      const noteSourceDir = path.dirname(filePath);
      const noteSlug = path.basename(filePath, ".md");
      const noteOutputDir = path.join(outputDir, "notes", dateString, noteSlug);
      copyReferencedImages(renderedHtml, noteSourceDir, noteOutputDir);

      return {
        title: data.title,
        date: data.date,
        tags,
        readTime: Math.ceil(content.split(" ").length / 200) + " min read",
        content: renderedHtml,
        path: `/notes/${dateString}/${noteSlug}/`,
      };
    })
    .filter(note => note !== null)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const tagCounts = {};
  notes.forEach(note => {
    note.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return { notes, tagCounts };
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("formatDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  );

  eleventyConfig.addFilter("map", (array, property) =>
    array.map((item) => item[property])
  );

  // Copy the entire CSS folder
  eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addFilter("flatten", (array) => array.flat());
  eleventyConfig.addFilter("unique", (array) => [...new Set(array)]);

  const pathPrefix = config.paths.baseURL;
  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);

  const notebookData = getNotebook();
  eleventyConfig.addCollection("notebook", () => notebookData.notes);
  eleventyConfig.addGlobalData("notebook", notebookData);

  return {
    dir: {
      input: config.paths.input,
      output: config.paths.output,
      data: config.paths.data,
    },
  };
};
