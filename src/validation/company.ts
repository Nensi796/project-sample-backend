import { ExpressValidator, ValidationChain } from 'express-validator';
import Company from '@api/company/company.model';

const myExpressValidator = new ExpressValidator();

const { body } = myExpressValidator;

export const createCompanyValidation: ValidationChain[] = [
  body('description').notEmpty().withMessage('Description is required'),

  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .custom(async (value) => {
      return await Company.findOne({ email: value, isDeleted: false }).then(
        (user) => {
          if (user) {
            return Promise.reject('Company already exist');
          }
        },
      );
    }),
];
