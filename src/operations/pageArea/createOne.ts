import PageArea from '@api/pageAreas/pageAreas.model';

const createNewPageArea = async (pageArea) => {
  try {
    const newPageArea = new PageArea(pageArea);
    return await newPageArea.save();
  } catch (error) {
    console.log('error', error);
    throw new Error(error);
  }
};

export default createNewPageArea;
