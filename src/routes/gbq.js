import { Router } from "express";
const gbqRouter = Router({ mergeParams: true });
import path from "path";
import { gbqController } from "../controllers/index.js"

gbqRouter.get('/test', gbqController.test);

export { gbqRouter };