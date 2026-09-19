import { Router } from 'express';
import { getUserCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getUserCart);
router.post('/', addToCart);
router.put('/:id', updateCartQuantity);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;
