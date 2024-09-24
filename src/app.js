import express from 'express';
const server = express();
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: "/config/.env" });

const PORT = process.env.PORT || 3000;

// # ROUTES

// Serve static files
server.use(express.static(path.join(path.resolve(), './src/public')));

// General routes
import * as routes from "./routes/index.js";
server.use('/', routes.miscRouter);
server.use('/bigquery', routes.gbqRouter);
server.use('/agent', routes.agentRouter);

// Run the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
