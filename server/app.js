import { createServer } from 'http';
import { readFileSync } from 'fs';
// * 정적 라우팅 예시

const port = 3000;
createServer((req, res) => {
  // 파일 읽고 보내는 함수
  const staticRoute = (
    needFile,
    statusCodeNumber,
    contentType = 'text/javascript',
    encoding = 'utf-8'
  ) => {
    const readFile = readFileSync(needFile, encoding, (err) => {
      if (err) throw err;
    });
    res.writeHead(statusCodeNumber, { 'Content-Type': contentType });
    res.write(readFile);
    res.end();
  };

  if ((req.method = 'GET')) {
    let url = req.url;
    console.log(url);

    // cors: 모든 접근 허용
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    switch (url) {
      case '/favicon.ico':
        staticRoute('public/img/favicon.png', 200, 'image/png', '');
        break;

      // 메인 index, js, css
      case '/':
        staticRoute('dist/index.html', 200, 'text/html');
        break;
      case url.endsWith('css') ? url : '':
        staticRoute(`dist${url}`, 200, 'text/css');
        break;
      case url.endsWith('js') ? url : '':
        staticRoute(`dist${url}`, 200);
        break;
      case url.endsWith('hdr') ? url : '':
        staticRoute(`dist${url}`, 200, 'image/vnd.radiance', '');
        break;
      case url.endsWith('png') ? url : '':
        staticRoute(`dist${url}`, 200, 'image/png', '');
        break;
      case url.endsWith('jpg') ? url : '':
        staticRoute(`dist${url}`, 200, 'image/jpeg', '');
        break;
      case url.startsWith('/public/gltf') ? url : '':
        staticRoute(`.${url}`, 200, 'model/gltf-binary', '');
        break;

      // 페이지네이션 용 GET 요청
      case '/root.html':
        staticRoute(`dist${url}`, 200, 'text/html');
        break;
      case '/routing.html':
        staticRoute(`dist${url}`, 200, 'text/html');
        break;
      case '/clock.html':
        staticRoute(`dist${url}`, 200, 'text/html');
        break;
      case '/ugauga.html':
        staticRoute(`dist${url}`, 200, 'text/html');
        break;
      case '/meojeonpass.html':
        staticRoute(`dist${url}`, 200, 'text/html');
        break;
      case '/ugauga_pr.html':
        staticRoute(`dist${url}`, 200, 'text/html');
        break;
      case '/meojeonpass_pr.html':
        staticRoute(`dist${url}`, 200, 'text/html');
        break;

      // mp4
      case url.endsWith('mp4') ? url : '':
        staticRoute(`dist${url}`, 200, 'video/mp4', '');
        break;
    }
  }
}).listen(port, () => {
  console.log(`${port}에서 서버 가동 중`);
});
