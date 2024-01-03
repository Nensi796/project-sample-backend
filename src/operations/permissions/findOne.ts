import Permission, { IPermission } from '@api/permissions/permission.model';

const permissionFindOne = async (
  filter: Record<string, any>,
): Promise<IPermission | null> => {
  return await Permission.findOne(filter);
};

export default permissionFindOne;
