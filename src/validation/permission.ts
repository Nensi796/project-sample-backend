import { ExpressValidator, ValidationChain } from 'express-validator';

const myExpressValidator = new ExpressValidator();

const { body } = myExpressValidator;

export const createPermissionValidation: ValidationChain[] = [
  body('pageAreasPermissions')
    .isArray({ min: 1 })
    .withMessage('PageAreasPermissions is required'),

  body('brandsPermissions')
    .isArray({ min: 1 })
    .withMessage('BrandsPermissions is required'),
];
