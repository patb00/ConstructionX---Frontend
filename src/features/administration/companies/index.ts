export type Company = {
  id: number;
  name: string;
  dateOfCreation: string;
};

export type NewCompanyRequest = {
  name: string;
  dateOfCreation: string;
};

export type UpdateCompanyRequest = {
  id: number;
  name: string;
  dateOfCreation: string;
};
