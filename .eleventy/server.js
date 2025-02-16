const http = require("http");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const chokidar = require("chokidar");
const { exec } = require("child_process");

const PORT = 5500;
const WATCH_DIR = path.join(__dirname, "_site");

const server = http.createServer((req, res) => {
  // Use URL to strip query parameters
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const filePath = path.join(
    WATCH_DIR,
    pathname.endsWith("/") ? `${pathname}index.html` : pathname
  );

  fs.stat(filePath, (err, stats) => {
    if (err || !stats) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found");
    }

    if (stats.isDirectory()) {
      const indexFilePath = path.join(filePath, "index.html");
      fs.readFile(indexFilePath, (err, content) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("404 Not Found");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      });
    } else {
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "text/plain";
      if (ext === ".html") {
        contentType = "text/html";
      } else if (ext === ".css") {
        contentType = "text/css";
      } else if (ext === ".js") {
        contentType = "application/javascript";
      } else if (ext.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
        contentType = "image/" + ext.substring(1);
      }
      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("WebSocket connection established.");
  ws.on("close", () => console.log("WebSocket connection closed."));
});

const watcher = chokidar.watch(WATCH_DIR, { ignoreInitial: true });
let buildInProgress = false;

watcher.on("change", (changedPath) => {
  console.log(`File changed: ${changedPath}`);

  if (!buildInProgress) {
    buildInProgress = true;
    exec("npx eleventy", (err, stdout, stderr) => {
      if (err) {
        console.error("Eleventy build error:", stderr);
      } else {
        console.log("Eleventy build complete.");
      }
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("reload");
        }
      });
      buildInProgress = false;
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Watching for changes in ${WATCH_DIR}`);
});
