const express = require('express');
const cors = require('cors');
const treeRoutes = require('./routes/treeRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trees', treeRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '🌳 Tree Visualizer Backend is RUNNING!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /health',
      'POST /api/trees/new',
      'POST /api/trees/1/insert',
      'GET  /api/trees/1/search/10', 
      'GET  /api/trees/1/traverse/inorder',
      'GET  /api/trees/1/state'
    ]
  });
});

// Health check - SIMPLE TEST
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('===================================');
  console.log('🚀 TREE VISUALIZER BACKEND STARTED');
  console.log('===================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log('-----------------------------------');
});