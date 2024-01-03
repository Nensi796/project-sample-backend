import { Router } from 'express';
import { getPaymentMethodData } from './paymentMethod.controller';

const router = Router();

router.get('/get-paymentmethods', getPaymentMethodData);

export default router;
