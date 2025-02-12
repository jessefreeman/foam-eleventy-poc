const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const md = new markdownIt();

const notesDir = path.resolve(__dirname, "../../../notes");
const outputDir = path.resolve(__dirname, "../../_site");

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

module.exports = () => {
  const notes = [];
  const tagCounts = {};

  fs.readdirSync(notesDir).forEach(folderName => {
    const folderPath = path.join(notesDir, folderName);
    if (!fs.statSync(folderPath).isDirectory()) return;

    fs.readdirSync(folderPath).forEach(file => {
      if (!file.endsWith(".md")) return;
      const filePath = path.join(folderPath, file);
      const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));

      if (!data.tags?.includes("public")) return;

      const renderedHtml = md.render(content || "");
      const postSlug = file.replace(".md", "");
      const noteOutputDir = path.join(outputDir, "notes", folderName, postSlug);
      copyReferencedImages(renderedHtml, path.dirname(filePath), noteOutputDir);

      const tags = ["all", ...data.tags.filter(tag => tag !== "public")];
      tags.forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1);

      notes.push({
        title: data.title,
        date: folderName,
        tags,
        readTime: Math.ceil(content.split(" ").length / 200) + " min read",
        content: renderedHtml,
        path: `./notes/${folderName}/${postSlug}/`
      });
    });
  });

  notes.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { notes, tagCounts };
};
