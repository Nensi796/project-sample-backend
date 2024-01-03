import Permission, { IPermission } from '@api/permissions/permission.model';

const permissionUpdateOne = async (
  filter: Record<string, any>,
  params: Record<string, any>,
): Promise<IPermission | null> => {
  const res = await Permission.findOneAndUpdate(filter, params);
  if (res) {
    return Permission.findOne(filter);
  }
  return res;
};

export default permissionUpdateOne;
