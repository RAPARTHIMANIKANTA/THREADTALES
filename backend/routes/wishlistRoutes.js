import { Router } from 'express';
import { getUserWishlist, toggleWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getUserWishlist);
router.post('/', toggleWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
