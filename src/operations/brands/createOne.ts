import Brand from '@api/brand/brand.model';

const createNewBrand = async (brand) => {
  try {
    const newBrand = new Brand(brand);
    return await newBrand.save();
  } catch (error) {
    throw new Error(error);
  }
};

export default createNewBrand;
