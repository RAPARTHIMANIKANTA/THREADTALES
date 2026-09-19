import { Router } from 'express';
import { chatWithAi, reindexRag } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', chatWithAi);
router.post('/reindex', reindexRag);

export default router;
