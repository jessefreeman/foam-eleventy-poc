const http = require("http");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const chokidar = require("chokidar");
const { exec } = require("child_process");

const PORT = 5500;
const WATCH_DIR = path.join(__dirname, "_site");

const reloadScript = `
<script>
  const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(wsProtocol + '//' + location.host + location.pathname);
  ws.onmessage = (message) => {
    if (message.data === 'reload') {
      console.log("Reloading page...");
      location.reload();
    }
  };
  ws.onclose = () => { console.warn("WebSocket connection closed."); };
  ws.onerror = (err) => { console.error("WebSocket error:", err); };
</script>
`;

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
  const effectivePath = req.url.endsWith("/") ? `${pathname}index.html` : pathname;
  const filePath = path.join(WATCH_DIR, effectivePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found");
    }

    const sendContent = (content, contentType) => {
      if (contentType === "text/html") {
        if (content.includes("</body>")) {
          content = content.replace("</body>", reloadScript + "</body>");
        } else {
          content += reloadScript;
        }
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    };

    if (stats.isDirectory()) {
      const indexFilePath = path.join(filePath, "index.html");
      fs.readFile(indexFilePath, "utf8", (err, content) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          return res.end("404 Not Found");
        }
        sendContent(content, "text/html");
      });
    } else {
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "text/plain";
      if (ext === ".html") contentType = "text/html";
      else if (ext === ".css") contentType = "text/css";
      else if (ext === ".js") contentType = "application/javascript";
      else if (ext.match(/\.(png|jpg|jpeg|gif|svg)$/)) contentType = "image/" + ext.substring(1);

      if (contentType === "text/html") {
        fs.readFile(filePath, "utf8", (err, content) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("404 Not Found");
          }
          sendContent(content, contentType);
        });
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
      }
    }
  });
});

const wss = new WebSocket.Server({ server });

// Heartbeat mechanism
function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", heartbeat);
  console.log("WebSocket connection established.");
  ws.on("close", () => console.log("WebSocket connection closed."));
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
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
