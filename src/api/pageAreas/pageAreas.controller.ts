import httpStatus from 'http-status';
import { catchAsync } from '@utils/catchAsync';
import { successResponse } from '@utils/response';
import createNewPageArea from '@operations/pageArea/createOne';
import PageArea, { IPageArea } from './pageAreas.model';

export const getPageAreas = catchAsync(async (req, res): Promise<void> => {
  const data: IPageArea[] = await PageArea.find(
    {},
    { __v: 0, createdAt: 0, updatedAt: 0 },
  );
  if (data.length == 0) {
    return res
      .status(httpStatus.OK)
      .json(successResponse('No Page Area Found', { pageAreas: [] }));
  }
  return res
    .status(httpStatus.OK)
    .json(successResponse('Successfully fetched', { pageAreas: data }));
});

export const createPageArea = catchAsync(async (req, res): Promise<void> => {
  const pageArea = await createNewPageArea({ ...req.body });
  return res
    .status(httpStatus.OK)
    .json(successResponse(`Successfully`, { pageArea }));
});
