import { useQuery } from "@tanstack/react-query";
import { companiesKeys } from "../api/companies.keys";
import { CompaniesApi } from "../api/companies.api";

export function useCompanies() {
  return useQuery({
    queryKey: companiesKeys.list(),
    queryFn: () => CompaniesApi.getAll(),
  });
}
