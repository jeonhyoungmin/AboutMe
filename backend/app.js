import { createServer } from "http";
import { readFileSync } from "fs";
import { url } from "inspector";
// * 정적 라우팅 예시

const port = 5000;

createServer((req, res) => {
  const staticRoute = (
    needFile,
    statusCodeNumber,
    contentType,
    encoding = "utf-8"
  ) => {
    const readFile = readFileSync(needFile, encoding, (err) => {
      if (err) throw err;
    });
    res.writeHead(statusCodeNumber, { "Content-Type": contentType });
    res.write(readFile);
    res.end();
  };

  let jsm = "../frontend/node_modules/three/examples/jsm";
  let jsmpath = "/node_modules/three/examples/jsm";
  if ((req.method = "GET")) {
    let url = req.url;
    console.log(url);
    switch (url) {
      case "/favicon.ico":
        let favicon = readFileSync("../frontend/public/image/favicon.glb");
        res.writeHead(200, { "Content-Type": "model/gltf-binary" });
        res.end(favicon);
        break;
      case "/":
        staticRoute("../frontend/src/index.html", 200, "text/html");
        break;
      case "/index.css":
        staticRoute("../frontend/src/index.css", 200, "text/css");
        break;
      case "/index.js":
        staticRoute("../frontend/src/index.js", 200, "text/javascript");
        break;
      case "/node_modules/three/build/three.module.js":
        staticRoute(
          "../frontend/node_modules/three/build/three.module.js",
          200,
          "text/javascript"
        );
        break;
      case `${jsmpath}/controls/OrbitControls.js`:
        staticRoute(`${jsm}/controls/OrbitControls.js`, 200, "text/javascript");
        break;
      case `${jsmpath}/loaders/GLTFLoader.js`:
        staticRoute(`${jsm}/loaders/GLTFLoader.js`, 200, "text/javascript");
        break;
      case `${jsmpath}/libs/stats.module.js`:
        staticRoute(`${jsm}/libs/stats.module.js`, 200, "text/javascript");
        break;
      case `${jsmpath}/math/Octree.js`:
        staticRoute(`${jsm}/math/Octree.js`, 200, "text/javascript");
        break;
      case `${jsmpath}/math/Capsule.js`:
        staticRoute(`${jsm}/math/Capsule.js`, 200, "text/javascript");
        break;
      case "/public/gltf/character.glb":
        staticRoute(
          "../frontend/public/gltf/character.glb",
          200,
          "model/gltf-binary",
          ""
        );
        break;
      case "/public/gltf/space.glb":
        staticRoute(
          "../frontend/public/gltf/space.glb",
          200,
          "model/gltf-binary",
          ""
        );
        break;
    }
  }
}).listen(port, () => {
  console.log(`${port}에서 서버 가동 중`);
});
