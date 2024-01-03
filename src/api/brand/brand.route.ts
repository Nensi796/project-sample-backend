import { Router } from 'express';
import { validate } from '@middlewares/validate';
import { isAdmin } from '@middlewares/isRole';
import { validateAuth } from '@middlewares/auth';
import { createBrandValidation } from '@validation/brands';
import { createBrand, getBrands } from './brand.controller';

const router = Router();

router.post('/get', getBrands);

router
  .route('/create')
  .post(validateAuth, isAdmin, validate(createBrandValidation), createBrand);

export default router;
