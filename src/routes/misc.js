import { Router } from "express";
const miscRouter = Router({ mergeParams: true });
import path from 'path';

// ### ROUTES
miscRouter.get('/random', (req, res) => {
  res.sendFile(path.join(path.resolve(), './src/views', 'random.html'));
});

export { miscRouter };