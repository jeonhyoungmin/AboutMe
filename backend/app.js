import { createServer } from 'http'
import { readFileSync } from 'fs'
// * 정적 라우팅 예시 
createServer((req, res) => {
  const staticRoute = (needFile, statusCodeNumber, contentType) => {
    const readFile = readFileSync(needFile, 'utf-8', (err) => {
      if (err) throw err
    })
    res.writeHead(statusCodeNumber, { "Content-Type": contentType })
    res.write(readFile)
    res.end()
  }

  let htmlFile = readFileSync('./01_basic.html', 'utf-8', (err) => {
    if (err) throw err
  })
  if (req.url === '/') {
    res.writeHead(200, { "Content-Type": "text/html" })
    res.write(htmlFile)
    res.end()
  } else if (req.url === '/01-basic.css') {
    const css = readFileSync('./01-basic.css', (err) => {
      if (err) throw err;
    })
    res.writeHead(200, { "Content-Type": "text/css" })
    res.write(css);
    res.end()
  } else if (req.url === '/01-basic.js') {
    const js = readFileSync('./01-basic.js', (err) => {
      if (err) throw err
    })
    res.writeHead(200, { "Content-Type": "text/javascript" })
    res.write(js)
    res.end()
  } else if (req.url === '/build/three.module.js') {
    const three = readFileSync('../build/three.module.js', (err) => {
      if (err) throw err
    })
    res.writeHead(200, { "Content-Type": "text/javascript`" })
    res.write(three)
    res.end()
  }
  console.log(req.url)



})
  .listen(5000, () => {
    console.log('서버 가동')
  })