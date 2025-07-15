import http from 'http';
import { WebSocketServer } from 'ws';

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server });

let sessionCount = 0;

wss.on('connection', (ws) => {
  sessionCount++;
  console.log(`✅ Client connected. Active sessions: ${sessionCount}`);
  broadcastSessionCount();

  ws.on('close', () => {
    sessionCount--;
    console.log(`🔌 Client disconnected. Active sessions: ${sessionCount}`);
    broadcastSessionCount();
  });
});

function broadcastSessionCount() {
  const message = JSON.stringify({ type: 'session_count', count: sessionCount });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

const PORT = process.env.PORT || 8080;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WebSocket server is running on ws://0.0.0.0:${PORT}`);
});
