import { Router } from 'express';
import { validateAuth } from '@middlewares/auth';
import {
  createAdminUserValidation,
  inviteUserValidation,
  setPasswordValidation,
  updateUserValidation,
} from '@validation/users';
import { isAdmin, isSuperAdmin } from '@middlewares/isRole';
import { validate } from '@middlewares/validate';
import {
  forgotPassword,
  verifyResetToken,
  createCompanyAdmin,
  setPassword,
  signIn,
  verifyOtp,
  resetPassword,
  updateUserDetail,
  inviteUser,
  verifySignupToken,
  getCompanyUsers,
  deleteUser,
  getCurrentUser,
} from './user.controller';

const router = Router();

// Create admin user
router
  .route('/signup')
  .post(
    validateAuth,
    isSuperAdmin,
    validate(createAdminUserValidation),
    createCompanyAdmin,
  );

router
  .route('/invite-user')
  .post(validateAuth, isAdmin, validate(inviteUserValidation), inviteUser);

router.post('/verify-signup-token', verifySignupToken);

// Login
router.post('/signin', signIn);

router.route('/get-current-user').get(validateAuth, getCurrentUser);

router.post('/set-password', validate(setPasswordValidation), setPassword);

router.route('/verify-otp').post(validateAuth, verifyOtp);

router.post('/forgot-password', forgotPassword);

router.post('/verify-reset-token', verifyResetToken);

router.post('/reset-password', resetPassword);

router
  .route('/get-users-by-company')
  .post(validateAuth, isAdmin, getCompanyUsers);

router.route('/delete').post(validateAuth, isAdmin, deleteUser);

router
  .route('/update')
  .put(validateAuth, validate(updateUserValidation), updateUserDetail);

export default router;
