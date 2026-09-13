import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiMiddleware } from './server/apiMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ─── API Middleware (handles all /api/v1/* routes) ───
app.use(apiMiddleware());

// ─── Serve Static Frontend (Vite build output) ───
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// ─── SPA Fallback: all non-API routes → index.html ───
app.get('*', (req, res) => {
  // Don't fallback API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Start Server ───
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🪔 HAVAN Studio is live!`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   → API: http://localhost:${PORT}/api/v1/events\n`);
});
