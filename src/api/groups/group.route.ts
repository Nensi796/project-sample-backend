import { Router } from 'express';
import { validateAuth } from '@middlewares/auth';
import { createGroupValidation } from '@validation/groups';
import { isAdmin } from '@middlewares/isRole';
import { validate } from '@middlewares/validate';
import {
  getGroupData,
  createGroup,
  deleteGroup,
  updateGroup,
} from './group.controller';

const router = Router();

router.route('/get-all').get(getGroupData);

router.route('/create').post(validate(createGroupValidation), createGroup);

router.route('/delete/:groupId').delete(validateAuth, isAdmin, deleteGroup);

router.route('/update/:groupId').put(validateAuth, isAdmin, updateGroup);

export default router;
