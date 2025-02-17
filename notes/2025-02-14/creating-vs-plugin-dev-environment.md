---
title: "Creating VS Plugin Dev Environment"
date: 2025-02-14
tags:
  - unsorted
  - public
---

# Creating VS Plugin Dev Environment

Trying to make a workspace where I can work on vs code plugins in realtime while I build out logic for my note takeing app.

## What am I trying to accomplish?

Outline goals, blockers, and plans.

## Key Takeaways

Summarize important insights.

## Notes & Discoveries

Here are steps I am doing

### Step 1: Clone the Plugin Repository

Run the following command inside the container or via a terminal connected to your `code-server`:

1. Open your terminal in `code-server` or connect to the container using Docker.

2. Clone the plugin repository into the `/workspace/plugins` directory:

   ```bash
   mkdir -p /workspace/plugins
   cd /workspace/plugins
   git clone git@github.com:rafaScalet/Let-Icons.git
   ```

3. Confirm the plugin has been cloned:

   ```bash
   ls /workspace/plugins
   ```

Got it! Let’s fix the permissions issue by running everything with `sudo`. Here’s the updated step:

---

### Step 2: Install Node.js and npm in the Container (with `sudo`)

> had to use sudo in coder instance for apt to work

1. **Update the package manager**:
   ```bash
   sudo apt-get update
   ```

2. **Install required tools**:
   ```bash
   sudo apt-get install -y curl
   ```

3. **Install Node.js**:
   Download and install Node.js (adjust `18.x` if you prefer a different version):

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
   sudo apt-get install -y nodejs
   ```

4. **Verify the installation**:
   ```bash
   node -v
   npm -v
   ```

### Step 3: Install Plugin Dependencies

Now that Node.js and npm are installed, let's set up the plugin dependencies:

1. **Navigate to the plugin directory**:
   ```bash
   cd /workspace/plugins/Let-Icons
   ```

2. **Install dependencies**:
   Run the following command to install the required Node.js packages:

   ```bash
   npm install
   ```

3. **Verify installation**:
   Ensure the dependencies are installed without errors. You should see a `node_modules` folder created in the directory.




## Tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Prompt Snippets

```
Enter prompt here
```

## Code Snippets

```
Enter code here
```

## Next Steps

- [ ] Next action

## Related Notes

- **Previous Note:** [[previous-note]] (Update this manually)

Note Created: 2025-02-14
