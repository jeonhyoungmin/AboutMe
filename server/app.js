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
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE'
    );
    // res.setHeader(
    //   'Access-Control-Allow-Headers',
    //   'Content-Type, Authorization'
    // );

    switch (url) {
      case '/favicon.ico':
        staticRoute('public/img/favicon.png', 200, 'image/png', '');
        break;

      // 메인 index, js, css
      case '/':
        staticRoute('dist/index.html', 200, 'text/html');
        break;
      case url.endsWith('css') ? url : '':
        staticRoute(`dist/${url}`, 200, 'text/css');
        break;
      case url.endsWith('js') ? url : '':
        staticRoute(`dist${url}`, 200);
        break;

      // 메인 페이지 3D 파일
      // case '/value.js':
      //   staticRoute(`../src${url}`, 200);
      //   break;
      // case url.startsWith('/node_modules') ? url : '':
      //   staticRoute(`${url}`, 200);
      //   break;
      case url.startsWith('/public/gltf') ? url : '':
        staticRoute(`.${url}`, 200, 'model/gltf-binary', '');
        break;

      // 페이지네이션 용 GET 요청
      case '/box':
        const data = {
          상자: '하이',
        };
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
        });
        res.write(JSON.stringify(data));
        res.end();
        break;
    }
  }
}).listen(port, () => {
  console.log(`${port}에서 서버 가동 중`);
});
