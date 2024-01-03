import Company, { ICompany } from '@api/company/company.model';

const companyUpdateOne = async (
  filter: Record<string, any>,
  params: Record<string, any>,
): Promise<ICompany | null> => {
  const res = await Company.findOneAndUpdate(filter, params);
  if (res) {
    return Company.findOne(filter);
  }
  return res;
};

export default companyUpdateOne;
