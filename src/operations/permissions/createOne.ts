import Permission from '@api/permissions/permission.model';

const createNewPermission = async (permission) => {
  try {
    const newPermission = new Permission(permission);
    return await newPermission.save();
  } catch (error) {
    throw new Error(error);
  }
};

export default createNewPermission;
