const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDir = path.resolve(__dirname, "../../../posts");

module.exports = () => {
  const posts = [];

  const getFiles = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath); // Recurse into subdirectories
      } else if (file.endsWith(".md")) {
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const { data, content } = matter(fileContents);

        // Generate a clean path relative to /posts/
        posts.push({
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          content,
          path: `/posts/${data.date.toISOString().split("T")[0]}/${file
            .replace(postsDir, "")
            .replace(/\\/g, "/")
            .replace(/\/\d{4}-\d{2}-\d{2}\//, "") // Remove date folders
            .replace(".md", "")}`, // Keep slug only
        });
        
        
      }
    });
  };

  getFiles(postsDir);

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    posts,
  };
};
