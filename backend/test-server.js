const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`📨 Received request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health endpoint
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      message: 'Server is working!',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Simple tree test endpoint
  if (req.url === '/api/trees/test' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Tree API is working!',
      testData: {
        tree: {
          value: 10,
          left: { value: 5 },
          right: { value: 15 }
        }
      }
    }));
    return;
  }
  
  // Default response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Tree Visualizer Backend',
    endpoints: [
      'GET /health',
      'GET /api/trees/test'
    ]
  }));
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log('🎯 SERVER STARTED SUCCESSFULLY!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/health`);
  console.log(`🌐 Tree Test: http://localhost:${PORT}/api/trees/test`);
  console.log('');
  console.log('🚨 OPEN A NEW TERMINAL TAB AND RUN:');
  console.log('curl http://localhost:5000/health');
});

// Handle errors
server.on('error', (err) => {
  console.log('❌ SERVER ERROR:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('Port 5000 is busy. Trying port 5001...');
    server.listen(5001);
  }
});