import { createServer } from "http";
import { readFileSync } from "fs";
// * 정적 라우팅 예시
createServer((req, res) => {
  const staticRoute = (needFile, statusCodeNumber, contentType) => {
    const readFile = readFileSync(needFile, "utf-8", (err) => {
      if (err) throw err;
    });
    res.writeHead(statusCodeNumber, { "Content-Type": contentType });
    res.write(readFile);
    res.end();
  };

  let jsm = "../frontend/node_modules/three/examples/jsm";

  if ((req.method = "GET")) {
    let url = req.url;
    switch (url) {
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
      case "/node_modules/three/examples/jsm/controls/OrbitControls.js":
        staticRoute(`${jsm}/controls/OrbitControls.js`, 200, "text/javascript");
        break;
      case "/node_modules/three/examples/jsm/loaders/GLTFLoader.js":
        staticRoute(`${jsm}/loaders/GLTFLoader.js`, 200, "text/javascript");
        break;
      case "/node_modules/three/examples/jsm/libs/stats.module.js":
        staticRoute(`${jsm}/libs/stats.module.js`, 200, "text/javascript");
        break;
      case "/node_modules/three/examples/jsm/math/Octree.js":
        staticRoute(`${jsm}/math/Octree.js`, 200, "text/javascript");
        break;
      case "/node_modules/three/examples/jsm/math/Capsule.js":
        staticRoute(`${jsm}/math/Capsule.js`, 200, "text/javascript");
        break;
      case "/public/gltf/character.glb":
        const readFile = readFileSync(
          "../frontend/public/gltf/character.glb",
          (err) => {
            if (err) throw err;
          }
        );
        res.writeHead(200, { "Content-Type": "model/gltf-binary" });
        res.write(readFile);
        res.end();
        break;
    }
  }
}).listen(5000, () => {
  console.log("서버 가동");
});
