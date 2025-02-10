const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const md = new markdownIt();

const notesDir = path.resolve(__dirname, "../../../notes");

// Function to generate an excerpt
function generateExcerpt(content, wordLimit = 30) {
  const words = content.split(/\s+/).slice(0, wordLimit).join(" ");
  return words + "...";
}

// Helper: copy images referenced in HTML
function copyReferencedImages(html, noteSourceDir, noteOutputDir) {
  const imageRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    if (!imgSrc.startsWith("http")) {
      const srcImage = path.join(noteSourceDir, imgSrc);
      const destImage = path.join(noteOutputDir, imgSrc);
      fs.mkdirSync(path.dirname(destImage), { recursive: true });
      try {
        fs.copyFileSync(srcImage, destImage);
      } catch (err) {
        console.error(`Failed to copy ${srcImage} to ${destImage}:`, err);
      }
    }
  }
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
        
        // Ensure tags exist and filter out non-public notes
        if (!data.tags || !data.tags.includes("public")) return;

        // Remove the "public" tag from the list
        const filteredTags = data.tags.filter(tag => tag !== "public");

        const renderedHtml = md.render(content || ""); 
        const excerpt = generateExcerpt(content);

        notes.push({
          title: data.title,
          date: data.date,
          tags: filteredTags, // Public tag is removed
          excerpt: generateExcerpt(content),
          readTime: Math.ceil(content.split(" ").length / 200) + " min read",
          content: renderedHtml,
          path: `./notes/${data.date.toISOString().split("T")[0]}/${file.replace(".md", "")}/`
        });
      }
    });
  };

  getFiles(notesDir);
  notes.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { notes };
};
