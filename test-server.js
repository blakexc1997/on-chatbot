const http = require('http');

const server = http.createServer((req, res) => {
  console.log('💥 Received a request!');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is alive!\n');
});

server.listen(5000, () => {
  console.log('✅ Test server running at http://localhost:5000');
});
