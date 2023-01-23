const { Server } = require('ws');
const { createServer } = require('http');
const { resolve } = require('path');

// dynamic constants
const html_file = Render.file(resolve(__dirname, './static/index.html')).toString();
const css_file = Render.file(resolve(__dirname, './static/styles.css')).toString();
const js_file = Render.file(resolve(__dirname, './static/script.js')).toString();

// http server
const http_server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html_file);
  } else if (req.method === 'GET' && req.url === '/styles.css') {
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end(css_file);
  } else if (req.method === 'GET' && req.url === '/script.js') {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(js_file);
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end(`Cannot ${req.method} ${req.url}`);
  }
});

http_server.listen(process.env.PORT, process.env.HOST, () => {
  Render.log(`HTTP server is listening on host ${process.env.HOST} and port ${process.env.PORT}`);
});

// websocket server
const ws_server = new Server({ server: http_server });

ws_server.on('connection', ws => {
  Render.log('new client connected');
  ws.on('message', message => {
    ws_server.clients.forEach(client => client.send(JSON.stringify(JSON.parse(message))));
  });
});
ws_server.on('error', error => {
  Render.log(error);
});
Render.log(`WS server is listening on host ${process.env.HOST} and port ${process.env.PORT}`);
