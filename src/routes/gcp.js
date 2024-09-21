import { Router } from "express";
const gcpRouter = Router({ mergeParams: true });
import path from "path";
import { gcpController } from "../controllers/index.js"

// ROUTES
gcpRouter.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), './src/views', 'random2.html'));
});

gcpRouter.get('/test', gcpController.test);

export { gcpRouter };