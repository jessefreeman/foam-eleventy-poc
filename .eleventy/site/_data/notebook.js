const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const removeMd = require("remove-markdown");
const md = new markdownIt();

const notesDir = path.resolve(__dirname, "../../../notes");
const outputDir = path.resolve(__dirname, "../../_site");

// Helper: Copy images referenced in HTML to the post-specific images folder
function copyReferencedImages(html, noteSourceDir, noteOutputDir) {
  const imageRegex = /<img[^>]+src=["']([^"']+)["']/g; // Match image tags and their "src" attributes
  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    if (!imgSrc.startsWith("http")) {
      const srcImage = path.join(noteSourceDir, imgSrc); // Original image location
      const destImage = path.join(noteOutputDir, "images", path.basename(imgSrc)); // Destination location
      fs.mkdirSync(path.dirname(destImage), { recursive: true }); // Ensure destination folder exists
      try {
        fs.copyFileSync(srcImage, destImage); // Copy the image
        console.log(`Copied: ${srcImage} -> ${destImage}`);
      } catch (err) {
        console.error(`Failed to copy ${srcImage}:`, err);
      }
    }
  }
}

// Function to generate an excerpt with a summary fallback
function generateExcerpt(data, content, wordLimit = 30) {
  if (data.summary?.trim()) return data.summary.trim(); // Use summary if available

  const firstBlock = content.split(/\n\s*\n/)[0]; // Get the first paragraph
  const cleanText = removeMd(firstBlock.replace(/!\[.*?\]\(.*?\)/g, "")); // Remove images & Markdown
  return cleanText.split(/\s+/).slice(0, wordLimit).join(" ") + "...";
}

module.exports = () => {
  const notes = [];

  const getFiles = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath);
      } else if (file.endsWith(".md")) {
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(fileContents);

        if (!data.tags?.includes("public")) return; // Skip non-public notes

        const renderedHtml = md.render(content || ""); // Render HTML from Markdown

        // Output directory for this specific post
        const postSlug = file.replace(".md", ""); // Get post slug from filename
        const noteOutputDir = path.join(
          outputDir,
          "notes",
          data.date.toISOString().split("T")[0],
          postSlug
        );

        // Copy images into the correct post-specific images folder
        const noteSourceDir = path.dirname(fullPath);
        copyReferencedImages(renderedHtml, noteSourceDir, noteOutputDir);

        notes.push({
          title: data.title,
          date: data.date,
          tags: data.tags.filter(tag => tag !== "public"), // Remove "public" tag
          excerpt: generateExcerpt(data, content),
          readTime: Math.ceil(content.split(" ").length / 200) + " min read",
          content: renderedHtml,
          path: `./notes/${data.date.toISOString().split("T")[0]}/${postSlug}/`,
        });
      }
    });
  };

  getFiles(notesDir);
  notes.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { notes };
};
