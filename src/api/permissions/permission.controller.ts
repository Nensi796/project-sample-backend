import httpStatus from 'http-status';
import { catchAsync } from '@utils/catchAsync';
import { errorResponse, successResponse } from '@utils/response';
import { ERROR_MESSAGE } from '@utils/constants';
import createNewPermission from '@operations/permissions/createOne';
import permissionFindOne from '@operations/permissions/findOne';
import permissionUpdateOne from '@operations/permissions/updateOne';

export const getPermissionData = catchAsync(async (req, res): Promise<void> => {
  const { permissionId } = req.params;

  if (!permissionId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('PermissionId is required', {}));
  }

  const permissionData = await permissionFindOne({
    _id: permissionId,
  });

  return res.status(httpStatus.OK).json(
    successResponse('Successfully', {
      permission: permissionData,
    }),
  );
});

export const createPermission = catchAsync(async (req, res): Promise<void> => {
  try {
    const permissionDetails = await createNewPermission({ ...req.body });
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Created', {
        isSuccess: true,
        permissionDetails,
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

export const updatePermission = catchAsync(async (req, res): Promise<void> => {
  const { permissionId } = req.params;
  if (!permissionId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('PermissionId is required', {}));
  }

  try {
    const permission = await permissionFindOne({
      _id: permissionId,
    });

    if (!permission) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse('Permission not exist', {
          isSuccess: false,
        }),
      );
    }

    await permissionUpdateOne({ _id: permissionId }, { $set: { ...req.body } });
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
