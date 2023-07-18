const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let state = 0; // Initial state

// RXJS (Programacion reactiva) --
// of(state).subscribe(x=>) if x == n -> soltar alarma

app.get('/state', (req, res) => {
  res.json({ state });
});

app.post('/state', (req, res) => {
  state++;
  broadcastState(state);
  res.json({ message: 'State updated successfully' });
});

function broadcastState(stateValue) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ state: stateValue }));
    }
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ state }));

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8000, () => {
  console.log('Server running on port 8080');
});
