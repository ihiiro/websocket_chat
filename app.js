const { Server } = require('ws');
const { createServer } = require('http');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// literal constants
const HTTP_PORT = 8080;
const WS_PORT = 8000;
const SHARED_HOST = '0.0.0.0';

// dynamic constants
const html_file = readFileSync(resolve(__dirname, './static/index.html'), 'utf8');
const css_file = readFileSync(resolve(__dirname, './static/styles.css'), 'utf8');
const js_file = readFileSync(resolve(__dirname, './static/script.js'), 'utf8');

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

http_server.listen(HTTP_PORT, SHARED_HOST, () => {
  console.log(`HTTP server is listening on host ${SHARED_HOST} and port ${HTTP_PORT}`);
});

// websocket server
const ws_server = new Server({ server: http_server });

ws_server.on('connection', ws => {
  console.log('new client connected');
  ws.on('message', message => {
    // ws.send(JSON.stringify(JSON.parse(message)));
    ws_server.clients.forEach(client => client.send(JSON.stringify(JSON.parse(message))));
  });
});
ws_server.on('error', error => {
  console.log(error);
});
console.log(`WS server is listening on host ${SHARED_HOST} and port ${WS_PORT}`);
