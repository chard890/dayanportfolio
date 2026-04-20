const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "0.0.0.0";
const port = 8080;
const root = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

http
  .createServer((req, res) => {
    const requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.stat(filePath, (statErr, stats) => {
      if (!statErr && stats.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }

      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          send(res, 404, "Not found");
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        send(res, 200, data, mimeTypes[ext] || "application/octet-stream");
      });
    });
  })
  .listen(port, host, () => {
    console.log(`Portfolio server running at http://192.168.1.10:${port}`);
  });
