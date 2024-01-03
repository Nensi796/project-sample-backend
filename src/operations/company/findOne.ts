import Company, { ICompany } from '@api/company/company.model';

const companyFindOne = async (
  filter: Record<string, any>,
): Promise<ICompany | null> => {
  return await Company.findOne(filter);
};

export default companyFindOne;
