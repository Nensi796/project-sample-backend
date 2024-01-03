import { Router } from 'express';
import { validateAuth } from '@middlewares/auth';
import { isAdmin } from '@middlewares/isRole';
import { validate } from '@middlewares/validate';
import {
  createPermission,
  getPermissionData,
  updatePermission,
} from './permission.controller';
import { createPermissionValidation } from '@validation/permission';

const router = Router();

router
  .route('/get-by-id/:permissionId')
  .get(validateAuth, isAdmin, getPermissionData);

router
  .route('/create')
  .post(
    validateAuth,
    isAdmin,
    validate(createPermissionValidation),
    createPermission, 
  );

router
  .route('/update/:permissionId')
  .put(validateAuth, isAdmin, updatePermission);

export default router;
