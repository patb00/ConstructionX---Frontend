import { useQuery } from "@tanstack/react-query";
import { companiesKeys } from "../api/companies.keys";
import { CompaniesApi } from "../api/companies.api";

export function useCompany(id?: number) {
  return useQuery({
    queryKey: id ? companiesKeys.detail(id) : companiesKeys.detail("nil"),
    queryFn: () => {
      if (!id) throw new Error("Missing tenant id");
      return CompaniesApi.getById(id);
    },
    enabled: !!id,
  });
}
