import { ExpressValidator, ValidationChain } from 'express-validator';
import User from '@api/users/user.model';

const myExpressValidator = new ExpressValidator();

const { body } = myExpressValidator;

export const createAdminUserValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('Name is required'),

  body('role').notEmpty().withMessage('Role is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email address')
    .bail()
    .custom(async (value) => {
      return await User.findOne({ email: value, isDeleted: false }).then(
        (user) => {
          if (user) {
            return Promise.reject('Email already in use');
          }
        },
      );
    }),

  body('phone').notEmpty().withMessage('Phone Number is required'),
];

export const inviteUserValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('name is required'),

  body('role').notEmpty().withMessage('role is required'),

  body('email')
    .notEmpty()
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email address')
    .bail()
    .custom(async (value) => {
      return await User.findOne({ email: value, isDeleted: false }).then(
        (user) => {
          if (user) {
            return Promise.reject('Email already in use');
          }
        },
      );
    }),

  body('phone').notEmpty().withMessage('Phone Number is required'),

  body('job').notEmpty().withMessage('job title is required'),

  body('company').notEmpty().withMessage('company is required'),

  body('isCustomGroup').notEmpty().withMessage('isCustomGroup is required'),
];

export const setPasswordValidation: ValidationChain[] = [
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must have a minimum of 8 characters that contains at least one lowercase letter, one uppercase letter, one number and one special character',
    ),
];

export const updateUserValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('name is required'),

  body('phone').notEmpty().withMessage('Phone Number is required'),
];
