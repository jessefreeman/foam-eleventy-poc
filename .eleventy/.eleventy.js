const config = require("./config");
const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt().use(require("markdown-it-prism"));
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// Helper: format a date to yyyy-mm-dd
const getDateString = (date) => {
  const d = new Date(date);
  return !isNaN(d) ? d.toISOString().split("T")[0] : "unknown";
};

// Helper: Recursively get markdown files from a directory
const getMarkdownFiles = (notesDir) => {
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
  return files;
};

// Copy images referenced in HTML from source to destination directory
const copyReferencedImages = (html, sourceDir, outputDir) => {
  const imageRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    if (!imgSrc.startsWith("http")) {
      const srcImage = path.join(sourceDir, imgSrc);
      const destImage = path.join(outputDir, "images", path.basename(imgSrc));
      fs.mkdirSync(path.dirname(destImage), { recursive: true });
      try {
        fs.copyFileSync(srcImage, destImage);
        console.log(`Copied: ${srcImage} -> ${destImage}`);
      } catch (err) {
        console.error(`Failed to copy ${srcImage}:`, err);
      }
    }
  }
};

const getNotebook = () => {
  const notesDir = path.resolve(__dirname, config.paths.notes);
  const outputDir = path.resolve(__dirname, config.paths.output);
  const markdownFiles = getMarkdownFiles(notesDir);

  const notes = markdownFiles
    .map((filePath) => {
      const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
      if (!data.tags || !data.tags.includes("public")) return null;
      const tags = ["all", ...data.tags.filter(tag => tag !== "public")];
      const dateString = getDateString(data.date);
      const renderedHtml = md.render(content || "");

      // Copy images referenced in the note
      const sourceDir = path.dirname(filePath);
      const noteSlug = path.basename(filePath, ".md");
      const noteOutputDir = path.join(outputDir, "notes", dateString, noteSlug);
      copyReferencedImages(renderedHtml, sourceDir, noteOutputDir);

      return {
        title: data.title,
        date: data.date,
        tags,
        readTime: Math.ceil(content.split(" ").length / 200) + " min read",
        content: renderedHtml,
        path: `/notes/${dateString}/${noteSlug}/`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const tagCounts = {};
  notes.forEach(note => {
    note.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return { notes, tagCounts };
};

module.exports = function (eleventyConfig) {
  // Add the syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);

  // Add filters
  eleventyConfig.addFilter("formatDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  );
  eleventyConfig.addFilter("shortDate", (date) => {
    const d = new Date(date);
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  });

  eleventyConfig.addFilter("sortedTags", (tags, showAll) => {
    let filtered = tags;
    if (!showAll) {
      filtered = tags.filter(t => t !== "all" && t !== "public");
    }
    filtered = [...filtered].sort();
    if (showAll && tags.includes("all")) {
      filtered = filtered.filter(t => t !== "all");
      filtered.unshift("all");
    }
    return filtered;
  });
  
  eleventyConfig.addFilter("map", (array, property) => array.map(item => item[property]));
  eleventyConfig.addFilter("flatten", (array) => array.flat());
  eleventyConfig.addFilter("unique", (array) => [...new Set(array)]);

  // Global data
  eleventyConfig.addGlobalData("pathPrefix", config.paths.baseURL);

  // Notebook collection and global notebook data (delayed execution)
  eleventyConfig.addCollection("notebook", () => {
    return getNotebook().notes;
  });
  eleventyConfig.addGlobalData("notebook", () => getNotebook());

  return {
    dir: {
      input: config.paths.input,
      output: config.paths.output,
      data: config.paths.data,
    },
    liveReload: false,
  };
};
