import { Router } from 'express';
import { 
  createContactInquiry, 
  getContactInquiries, 
  createCustomProductRequest, 
  getCustomProductRequests 
} from '../controllers/contactController.js';

const router = Router();

// General Contact Inquiries
router.post('/inquiry', createContactInquiry);
router.get('/inquiries', getContactInquiries);

// Bespoke Custom Product Requests
router.post('/custom-request', createCustomProductRequest);
router.get('/custom-requests', getCustomProductRequests);

export default router;
