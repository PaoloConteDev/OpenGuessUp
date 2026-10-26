import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".wav": "audio/wav",
  ".json": "application/json",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/__mobile") {
        res.setHeader("Content-Type", "text/html");
        res.end(
          '<html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#E9F2FC;display:grid;place-items:center;height:100vh"><iframe title="Open GuessUp mobile" src="/?lang=it" style="height:844px;max-height:96vh;width:390px;max-width:calc(100vw - 16px);border:1px solid #D8E1EC;border-radius:28px"></iframe></body></html>',
        );
        return;
      }
      const requested = path.resolve(
        root,
        "." + decodeURIComponent(url.pathname),
      );
      if (!requested.startsWith(root + path.sep) && requested !== root) {
        res.writeHead(403).end();
        return;
      }
      let file = requested;
      try {
        if ((await stat(file)).isDirectory())
          file = path.join(file, "index.html");
      } catch {
        file = path.join(root, "index.html");
      }
      const body = await readFile(file);
      res.setHeader(
        "Content-Type",
        mime[path.extname(file)] ?? "application/octet-stream",
      );
      res.setHeader("Cache-Control", "no-store");
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  })
  .listen(4174, "127.0.0.1", () =>
    console.log("Open GuessUp: http://127.0.0.1:4174"),
  );
