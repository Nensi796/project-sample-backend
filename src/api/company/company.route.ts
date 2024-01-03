import { Router } from 'express';
import { validateAuth } from '@middlewares/auth';
import { isAdmin } from '@middlewares/isRole';
import { createCompanyValidation } from '@validation/company';
import { validate } from '@middlewares/validate';
import {
  getCompanyData,
  createCompany,
  deleteCompany,
  updateCompany,
} from './company.controller';

const router = Router();

router.get('/get', getCompanyData);

router
  .route('/create')
  .post(
    validateAuth,
    isAdmin,
    validate(createCompanyValidation),
    createCompany,
  );

router.route('/delete/:companyId').delete(validateAuth, isAdmin, deleteCompany);

router.route('/update/:companyId').put(validateAuth, isAdmin, updateCompany);

export default router;
