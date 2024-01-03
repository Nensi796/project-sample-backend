import { ExpressValidator, ValidationChain } from 'express-validator';
import PageArea from '@api/pageAreas/pageAreas.model';

const myExpressValidator = new ExpressValidator();

const { body } = myExpressValidator;

export const createPageAreaValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('PageArea is required')
    .bail()
    .custom(async (value) => {
      return await PageArea.findOne({ name: value }).then((pageArea) => {
        if (pageArea) {
          return Promise.reject('PageArea name already in use');
        }
      });
    }),

  body('value')
    .notEmpty()
    .withMessage('value is required')
    .bail()
    .custom(async (value) => {
      return await PageArea.findOne({ value }).then((pageArea) => {
        if (pageArea) {
          return Promise.reject('PageArea value already in use');
        }
      });
    }),
];
