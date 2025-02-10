const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const removeMd = require("remove-markdown");
const md = new markdownIt();

const notesDir = path.resolve(__dirname, "../../../notes");

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

        notes.push({
          title: data.title,
          date: data.date,
          tags: data.tags.filter(tag => tag !== "public"), // Remove "public" tag
          excerpt: generateExcerpt(data, content),
          readTime: Math.ceil(content.split(" ").length / 200) + " min read",
          content: md.render(content || ""),
          path: `./notes/${data.date.toISOString().split("T")[0]}/${file.replace(".md", "")}/`
        });
      }
    });
  };

  getFiles(notesDir);
  notes.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { notes };
};
