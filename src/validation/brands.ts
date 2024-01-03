import { ExpressValidator, ValidationChain } from 'express-validator';
import Brand from '@api/brand/brand.model';
import Company from '@api/company/company.model';

const myExpressValidator = new ExpressValidator();

const { body } = myExpressValidator;

export const createBrandValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Brand Name is required')
    .bail()
    .custom(async (value) => {
      return await Brand.findOne({ name: value }).then((pageArea) => {
        if (pageArea) {
          return Promise.reject('Brand already exist');
        }
      });
    }),

  body('description').notEmpty().withMessage('description is required'),

  body('companyId')
    .notEmpty()
    .withMessage('companyId is required')
    .bail()
    .custom(async (value) => {
      return await Company.findOne({ _id: value }).then((company) => {
        if (!company) {
          return Promise.reject('Company does not exist');
        }
      });
    }),
];
