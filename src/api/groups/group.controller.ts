import httpStatus from 'http-status';
import { catchAsync } from '@utils/catchAsync';
import { errorResponse, successResponse } from '@utils/response';
import { ERROR_MESSAGE } from '@utils/constants';
import createNewGroup from '@operations/groups/createOne';
import Groups from './group.model';
import groupsFindOne from '@operations/groups/findOne';
import groupsUpdateOne from '@operations/groups/updateOne';
import createNewPermission from '@operations/permissions/createOne';
import permissionUpdateOne from '@operations/permissions/updateOne';

export const getGroupData = catchAsync(async (req, res): Promise<void> => {
  const groupData = await Groups.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: 'permissions',
        localField: 'permissionId',
        foreignField: '_id',
        as: 'permission',
      },
    },
    {
      $unwind: '$permission',
    },
  ]);
  if (!groupData) {
    return res
      .status(httpStatus.OK)
      .json(successResponse('No Group Found', { groups: [] }));
  }
  return res.status(httpStatus.OK).json(
    successResponse('Successfully', {
      groups: groupData,
    }),
  );
});

export const createGroup = catchAsync(async (req, res): Promise<void> => {
  try {
    const permissionPayload = {
      pageAreasPermissions: req.body.pageAreasPermissions,
      brandsPermissions: req.body.brandsPermissions,
    };
    const permissionDetails = await createNewPermission(permissionPayload);
    req.body.permissionId = permissionDetails._id;
    const groupDetails = await createNewGroup({ ...req.body });
    return res.status(httpStatus.OK).json(
      successResponse('Successfully Created', {
        isSuccess: true,
        groupDetails,
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

export const deleteGroup = catchAsync(async (req, res): Promise<void> => {
  const { groupId } = req.params;

  if (!groupId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('GroupId is required', {}));
  }

  try {
    const group = await groupsFindOne({
      _id: groupId,
      isDeleted: false,
    });
    if (!group) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse('Group does not exist', {
          isSuccess: false,
        }),
      );
    }

    await groupsUpdateOne({ _id: groupId }, { $set: { isDeleted: true } });
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

export const updateGroup = catchAsync(async (req, res): Promise<void> => {
  const { groupId } = req.params;
  if (!groupId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('GroupId is required', {}));
  }

  try {
    const group = await groupsFindOne({
      _id: groupId,
      isDeleted: false,
    });
    if (!group) {
      return res.status(httpStatus.BAD_REQUEST).json(
        errorResponse('Group does not exist', {
          isSuccess: false,
        }),
      );
    }

    const permissionPayload = {
      pageAreasPermissions: req.body.pageAreasPermissions,
      brandsPermissions: req.body.brandsPermissions,
    };
    await permissionUpdateOne(
      { _id: req.body.permissionId },
      { $set: { ...permissionPayload } },
    );

    const payload = {
      name: req.body.name || group.name,
      description: req.body.description || group.description,
    };

    await groupsUpdateOne({ _id: groupId }, { $set: { ...payload } });
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
