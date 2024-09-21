import { Router } from "express";
const agentRouter = Router({ mergeParams: true });
import path from 'path';

agentRouter.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), './src/views', 'agent.html'));
});

export { agentRouter };