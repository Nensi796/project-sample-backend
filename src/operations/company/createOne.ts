import Company from '@api/company/company.model';

const createNewCompany = async (company) => {
  try {
    const newCompany = new Company(company);
    return await newCompany.save();
  } catch (error) {
    throw new Error(error);
  }
};

export default createNewCompany;
