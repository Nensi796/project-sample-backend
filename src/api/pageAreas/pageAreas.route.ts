import { Router } from 'express';
import { validateAuth } from '@middlewares/auth';
import { createPageAreaValidation } from '@validation/pageAreas';
import { isAdmin } from '@middlewares/isRole';
import { validate } from '@middlewares/validate';
import { createPageArea, getPageAreas } from './pageAreas.controller';

const router = Router();

router.route('/get-all').get(validateAuth, getPageAreas);

router
  .route('/create')
  .post(
    validateAuth,
    isAdmin,
    validate(createPageAreaValidation),
    createPageArea,
  );

export default router;
