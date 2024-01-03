import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '@utils/catchAsync';
import { APIError } from '@utils/APIError';
import Customer, { ICustomer } from './customer.model';

export const getCustomerData = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const customerData: ICustomer[] = await Customer.find();
    if (customerData.length == 0) {
      throw new APIError(
        'Customer not found',
        'getCustomerData',
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    res.json(customerData);
  },
);
