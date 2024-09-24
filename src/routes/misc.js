import { Router } from "express";
const miscRouter = Router({ mergeParams: true });
import path from 'path';

miscRouter.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), './src/views', 'index.html'));
});

export { miscRouter };