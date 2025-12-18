import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import uploadDocument from '../middleware/uploadDocuments';


const router = Router();

router.post(
  '/',
  authMiddleware,
  uploadDocument.single('file'),

);

export default router;
