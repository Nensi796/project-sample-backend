import Group from '@api/groups/group.model';

const createNewGroup = async (group) => {
  try {
    const newGroup = new Group(group);
    return await newGroup.save();
  } catch (error) {
    throw new Error(error);
  }
};

export default createNewGroup;
