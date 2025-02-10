const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const markdownIt = require("markdown-it");
const md = new markdownIt();

const postsDir = path.resolve(__dirname, "../../../posts");

// Function to generate an excerpt
function generateExcerpt(content, wordLimit = 30) {
  const words = content.split(/\s+/).slice(0, wordLimit).join(" ");
  return words + "...";
}

// Helper: copy images referenced in HTML
function copyReferencedImages(html, postSourceDir, postOutputDir) {
  const imageRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    // Only process relative paths
    if (!imgSrc.startsWith("http")) {
      const srcImage = path.join(postSourceDir, imgSrc);
      const destImage = path.join(postOutputDir, imgSrc);
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
  const posts = [];

  const getFiles = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath);
      } else if (file.endsWith(".md")) {
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(fileContents);
        const renderedHtml = md.render(content || ""); // Ensure empty content doesn't break it
        const excerpt = generateExcerpt(content);

        posts.push({
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          excerpt: generateExcerpt(content),
          readTime: Math.ceil(content.split(" ").length / 200) + " min read",
          content: renderedHtml, // Ensure this is included
          path: `./posts/${data.date.toISOString().split("T")[0]}/${file.replace(".md", "")}/`
        });        
      }
    });
  };

  getFiles(postsDir);
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { posts };
};
