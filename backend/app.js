import { createServer } from "http";
import { readFileSync } from "fs";
// * 정적 라우팅 예시

const port = 5500;
createServer((req, res) => {
  const staticRoute = (
    needFile,
    statusCodeNumber,
    contentType = "text/javascript",
    encoding = "utf-8"
  ) => {
    const readFile = readFileSync(needFile, encoding, (err) => {
      if (err) throw err;
    });
    res.writeHead(statusCodeNumber, { "Content-Type": contentType });
    res.write(readFile);
    res.end();
  };

  if ((req.method = "GET")) {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader(
    //   "Access-Control-Allow-Methods",
    //   "GET, POST, PUT, PATCH, DELETE"
    // );
    // res.setHeader(
    //   "Access-Control-Allow-Headers",
    //   "Content-Type, Authorization"
    // );
    let url = req.url;
    console.log(url);
    switch (url) {
      case "/box":
        const data = {
          상자: "하이",
        };
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.write(JSON.stringify(data));
        res.end();
        break;
      case "/favicon.ico":
        staticRoute(
          "../frontend/public/image/favicon.png",
          200,
          "image/png",
          ""
        );
        break;
      case "/":
        staticRoute("../frontend/src/index.html", 200, "text/html");
        break;
      case url.endsWith("css") ? url : "":
        staticRoute(`../frontend/src${url}`, 200, "text/css");
        break;
      case "/index.js":
        staticRoute(`../frontend/src${url}`, 200);
        break;
      case "/value.js":
        staticRoute(`../frontend/src${url}`, 200);
        break;
      case url.startsWith("/node_modules") ? url : "":
        staticRoute(`../frontend${url}`, 200);
        break;
      case url.startsWith("/public/gltf") ? url : "":
        staticRoute(`../frontend${url}`, 200, "model/gltf-binary", "");
        break;
    }
  }
}).listen(port, () => {
  console.log(`${port}에서 서버 가동 중`);
});
