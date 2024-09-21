import express from 'express';
const server = express();
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: "/config/.env" });

const PORT = process.env.PORT || 3000;

// Serve static files
server.use(express.static(path.join(path.resolve(), './src/public')));

// ### ROUTES
// *** Option 1: Serve the index.html file directly *** 
server.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), './src/views', 'index.html'));
});
// *** Option 2: Use a separate route file, that might use a controller ***

// General
import * as routes from "./routes/index.js";
server.use('/', routes.miscRouter);
server.use('/bigquery', routes.gcpRouter);
server.use('/agent', routes.agentRouter);

// Run the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
