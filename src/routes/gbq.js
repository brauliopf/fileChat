import { Router } from "express";
const gbqRouter = Router({ mergeParams: true });
import path from "path";
import { gbqController } from "../controllers/index.js"

gbqRouter.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), './src/views', 'random2.html'));
});

gbqRouter.get('/test', gbqController.test);

export { gbqRouter };