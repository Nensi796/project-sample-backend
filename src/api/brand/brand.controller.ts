import httpStatus from 'http-status';
import { catchAsync } from '@utils/catchAsync';
import { errorResponse, successResponse } from '@utils/response';
import { ERROR_MESSAGE } from '@utils/constants';
import createNewBrand from '@operations/brands/createOne';
import companyUpdateOne from '@operations/company/updateOne';
import Brand, { IBrand } from './brand.model';

export const getBrands = catchAsync(async (req, res): Promise<void> => {
  const { filter } = req.body;
  const brandData: IBrand[] = await Brand.find(filter);
  if (brandData.length == 0) {
    return res
      .status(httpStatus.OK)
      .json(successResponse('No Brand Found', { brands: [] }));
  }
  return res
    .status(httpStatus.OK)
    .json(successResponse('Successfully', { brands: brandData }));
});

export const createBrand = catchAsync(async (req, res): Promise<void> => {
  try {
    const brand = await createNewBrand({ ...req.body });
    await companyUpdateOne(
      { _id: req.body.companyId },
      { $push: { brands: brand._id } },
    );
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Created', {
        isSuccess: true,
        brand,
      }),
    );
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(ERROR_MESSAGE.SOMETHING_WENT_WRONG, { isSuccess: false }),
      );
  }
});
