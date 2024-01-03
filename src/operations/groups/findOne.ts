import Group, { IGroup } from '@api/groups/group.model';

const groupFindOne = async (
  filter: Record<string, any>,
): Promise<IGroup | null> => {
  return await Group.findOne(filter);
};

export default groupFindOne;
