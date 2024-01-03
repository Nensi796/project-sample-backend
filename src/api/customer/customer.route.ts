import { Router } from 'express';
import { getCustomerData } from './customer.controller';

const router = Router();

router.get('/get-customers', getCustomerData);

export default router;
