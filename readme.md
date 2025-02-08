# **Foam Knowledge Base & Blog Setup**

This repository is designed to **organize personal notes, daily logs, and blog posts** using Foam and publish shareable content via **GitHub Pages**.

## **Foam Basics**

Foam is a **personal knowledge management tool** built on **VS Code + Markdown**. It allows:

- **Backlinking (`[[note-name]]`)** to connect notes.
- **Graph view** to visualize relationships.
- **Templates** to quickly create structured notes.

### **Core Commands**

| Action                  | Command                                 |
| ----------------------- | --------------------------------------- |
| Create a new note       | `Foam: Create New Note`               |
| Create from template    | `Foam: Create New Note From Template` |
| Open today's daily note | `Foam: Open Daily Note`               |
| Fix broken links        | `Foam: Run Janitor`                   |
| Preview Foam Graph      | `Foam: Show Graph`                    |

## **Folder Structure & Workflow**

To maintain **organization and clarity**, notes are categorized into three sections:

```
docs/               # Personal dev notes (private)`
inbox/              # Daily notes (private)
pages/
├── _posts/         # Blog posts (public)
├── assets/images/  # Images for blog posts
└── _config.yml     # GitHub Pages settings
```

### **1️⃣ Daily Notes (`inbox/YYYY/MM/DD.md`)**

- Stored in`/inbox/` under**year/month/day.md**.
- Used for**logging daily thoughts, meetings, work summaries**.
- Created using the`Foam: Open Daily Note` command.
- **Private**,**not published** to GitHub Pages.

### **2️⃣ General Notes (`notes/`)**

- Stored in`/notes/` and organized by topic.
- Used for**project documentation, ideas, research, learning**.
- Can be linked using`[[note-name]]`.
- **Private**,**not published** to GitHub Pages.

### **3️⃣ Blog Posts (`_posts/YYYY-MM-DD-title.md`)**

- Stored in`/_posts/` with filenames**`YYYY-MM-DD-title.md`**.
- Written as cleaned-up,**public-facing content** derived from notes.
- Published to GitHub Pages and automatically indexed in`/blog/`.

### **Images for Posts**

- **Stored in `/assets/images/`**.
- Referenced using relative paths:
  ```markdown
  ![Alt text](../assets/images/image-name.jpg)
  ```

---

## **Publishing Blog Posts via GitHub Pages**

GitHub Pages is configured to **automatically publish anything in `/pages/`**.To enable it:

1. **Go to repository settings** →`Settings > Pages`.
2. **Under "Source"**, choose**"Deploy from a branch"**.
3. **Set "Branch" to `main`**, and folder to`/pages/`.
4. **Click "Save"**.
5. **Your blog will be live at:**
   ```
   https://yourusername.github.io/repository-name/blog/
   ```

### **How New Blog Posts Get Published**

- Add a new file in`_posts/` following the format**`YYYY-MM-DD-title.md`**.
- Push changes to`main`, and GitHub Pages will**auto-generate the blog index**.

---

## **Foam Workflow Summary**

| Task              | Location                        | Notes                                      |
| ----------------- | ------------------------------- | ------------------------------------------ |
| Quick daily logs  | `/inbox/YYYY/MM/DD.md`        | Private, for tracking work & thoughts      |
| Permanent notes   | `/notes/`                     | Organized reference notes, research, ideas |
| Public blog posts | `/_posts/YYYY-MM-DD-title.md` | Shared articles, published automatically   |
| Images for posts  | `/assets/images/`             | Stored separately for Markdown linking     |

**Use daily notes to track work, developer notes for a specific project or feature, and blog posts to share polished content.**
