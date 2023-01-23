const { Server } = require('ws');
const { createServer } = require('https');
const { resolve } = require('path');
const { readFileSync } = require('fs');

// dynamic constants
const html_file = readFileSync(resolve(__dirname, './static/index.html'), 'utf8');
const css_file = readFileSync(resolve(__dirname, './static/styles.css'), 'utf8');
const js_file = readFileSync(resolve(__dirname, './static/script.js'), 'utf8');

// http server
const https_server = createServer((req, res) => {
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

https_servers.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`HTTPS server is listening on host ${process.env.HOST} and port ${process.env.PORT}`);
});

// websocket server
const wss_server = new Server({ server: https_server });

wss_server.on('connection', ws => {
  console.log('new client connected');
  ws.on('message', message => {
    wss_server.clients.forEach(client => client.send(JSON.stringify(JSON.parse(message))));
  });
});
wss_server.on('error', error => {
  console.log(error);
});
console.log(`WSS server is listening on host ${process.env.HOST} and port ${process.env.PORT}`);
