import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '@utils/catchAsync';
import { APIError } from '@utils/APIError';
import PaymentMethod, { IPaymentMethod } from './paymentMethod.model';

export const getPaymentMethodData = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const paymentMethodData: IPaymentMethod[] = await PaymentMethod.find();
    if (paymentMethodData.length == 0) {
      throw new APIError(
        'PaymentMethod not found',
        'getPaymentMethodData',
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    res.json(paymentMethodData);
  },
);
