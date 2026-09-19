import { Router } from 'express';
import { createOrder, getUserOrders, getOrderDetails } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:orderId', getOrderDetails);

export default router;
