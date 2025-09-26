import { useCompanies } from "../../hooks/companies/useCompanies";

const CompaniesListPage = () => {
  const { data } = useCompanies();

  console.log("data", data);
  return <div>{JSON.stringify(data)}</div>;
};

export default CompaniesListPage;
