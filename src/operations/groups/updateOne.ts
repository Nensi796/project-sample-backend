import Group, { IGroup } from '@api/groups/group.model';

const groupUpdateOne = async (
  filter: Record<string, any>,
  params: Record<string, any>,
): Promise<IGroup | null> => {
  const res = await Group.findOneAndUpdate(filter, params);
  if (res) {
    return Group.findOne(filter);
  }
  return res;
};

export default groupUpdateOne;
