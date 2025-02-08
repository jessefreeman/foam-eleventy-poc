---
layout: default
title: "Foam Eventy Tutorial"
date: 2025-02-08
tags: [blog, unsorted]
---

## Setting Up Foam with Eleventy for Blogging

This tutorial walks you through setting up a blogging system using Foam and Eleventy. Follow these steps to reproduce the setup.

### Step 1: Start with Your Foam Template
1. Clone the v13 version of your Foam template.
2. Install Node.js and npm:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm
   ```
3. Reset the Git repository:
   ```bash
   rm -rf .git
   git init
   ```

### Step 2: Update the Foam Post Template Path
1. Modify the Foam template configuration to set the `filepath` for posts:
   ```plaintext
   filepath: "posts/$FOAM_DATE_YEAR-$FOAM_DATE_MONTH/$FOAM_DATE_DATE-$FOAM_SLUG.md"
   ```
   This ensures posts are created under `/posts/`, organized by year and month, and named with the date and slug.

2. Create a `trash` folder for managing discarded notes.

### Step 3: Create the Folder Structure
Establish the following folder structure:

```
/workspace
  posts/             <-- Markdown posts
  .eleventy/         <-- Config, _layouts, _includes, assets
  _site/             <-- Output
```

### Step 4: Create a Default Layout
Inside `.eleventy/_layouts/`, create `default.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
  <header>
    <h1>{{ title }}</h1>
    <p><small>{{ date }}</small></p>
  </header>
  <main>
    {{ content | safe }}
  </main>
</body>
</html>
```

### Step 5: Create the Eleventy Configuration File
Inside `.eleventy`, create `.eleventy.js` with this content:

```javascript
module.exports = function (eleventyConfig) {
  // Copy images and static assets to _site
  eleventyConfig.addPassthroughCopy("../posts/**/*.png");
  eleventyConfig.addPassthroughCopy("../posts/**/*.jpg");
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: "../posts",           // from .eleventy folder, go up to posts
      includes: "../.eleventy/_includes",
      layouts: "../.eleventy/_layouts",
      output: "../_site"
    },
  };
};
```

### Step 6: Add Styles
Create `.eleventy/assets/styles.css` with this content:

```css
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

header {
  background: #f4f4f4;
  padding: 1rem 2rem;
}

header h1 {
  margin: 0;
}

main {
  padding: 2rem;
}
```

### Step 7: Configure Node.js and Install Eleventy
1. Inside `.eleventy`, manually create a `package.json` file to avoid issues with the folder name starting with a dot:

   ```bash
   cat << 'EOF' > package.json
   {
     "name": "my-eleventy",
     "version": "1.0.0",
     "private": true,
     "scripts": {
       "start": "eleventy --serve -c .eleventy.js"
     }
   }
   EOF
   ```

2. Install Eleventy:
   ```bash
   npm install @11ty/eleventy
   ```

### Step 8: Run Eleventy
1. Navigate to the `.eleventy` folder and run:
   ```bash
   cd .eleventy
   npx eleventy --serve --config .eleventy.js
   ```

2. Preview your generated post by checking the `_site` folder:
   ```bash
   ls _site/2025-02/08-title-of-my-new-note/index.html
   ```
   Open the post in your browser using the URL:
   ```
   https://code.weekendcodeproject.com/@jessefreeman/foam-eleventy-mvp.main/apps/code-server/proxy/8080/2025-02/08-title-of-my-new-note/
   ```

### Step 9: Update `.gitignore`
Add the following to your `.gitignore` file to exclude unnecessary files:

```plaintext
# Ignore temporary files
*.log
.DS_Store
Thumbs.db

# Ignore generated site output
_site/

# Ignore node_modules in the .eleventy folder
.eleventy/node_modules/

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Ignore trash
trash
```

### Summary
By following these steps, you’ve set up a blogging system with Foam and Eleventy. The posts are organized neatly by date, layouts are customizable, and the entire setup is ready for preview and deployment. If you encounter issues, revisit the configuration paths or Eleventy commands. Let me know if further adjustments are needed!


