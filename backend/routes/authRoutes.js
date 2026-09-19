import { Router } from 'express';
import { sendOtp, verifyOtp, getProfile, updateProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;
