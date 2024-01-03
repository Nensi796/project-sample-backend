import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '@utils/catchAsync';
import { APIError } from '@utils/APIError';
import { errorResponse, successResponse } from '@utils/response';
import createNewCompany from '@operations/company/createOne';
import Company, { ICompany } from './company.model';
import companyFindOne from '@operations/company/findOne';
import companyUpdateOne from '@operations/company/updateOne';
import { ERROR_MESSAGE } from '@utils/constants';

export const getCompanyData = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const companyData: ICompany[] = await Company.find({ isDeleted: false });
    if (companyData.length == 0) {
      throw new APIError(
        'Company not found',
        'getCompanyData',
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    res.json(companyData);
  },
);

// Create a new company
export const createCompany = catchAsync(async (req, res): Promise<void> => {
  const company = await createNewCompany({ ...req.body });
  return res
    .status(httpStatus.OK)
    .json(successResponse(`Successfully created`, { company }));
});

export const deleteCompany = catchAsync(async (req, res): Promise<void> => {
  const { companyId } = req.params;

  if (!companyId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('CompanyId is required', {}));
  }

  try {
    const user = await companyFindOne({
      _id: companyId,
      isDeleted: false,
    });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse('Company does not exist', {
          isSuccess: false,
        }),
      );
    }

    await companyUpdateOne({ _id: companyId }, { $set: { isDeleted: true } });
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Deleted', {
        isSuccess: true,
      }),
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(ERROR_MESSAGE.SOMETHING_WENT_WRONG, {
        isSuccess: false,
      }),
    );
  }
});

export const updateCompany = catchAsync(async (req, res): Promise<void> => {
  const { companyId } = req.params;
  if (!companyId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('CompanyId is required', {}));
  }

  try {
    const user = await companyFindOne({
      _id: companyId,
      isDeleted: false,
    });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse('Company does not exist', {
          isSuccess: false,
        }),
      );
    }
    await companyUpdateOne({ _id: companyId }, { $set: { ...req.body } });
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Updated', {
        isSuccess: true,
      }),
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(ERROR_MESSAGE.SOMETHING_WENT_WRONG, {
        isSuccess: false,
      }),
    );
  }
});
