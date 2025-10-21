import { useQuery } from "@tanstack/react-query";
import type { ConstructionSite } from "..";
import type { GridColDef } from "@mui/x-data-grid";
import { constructionSitesKeys } from "../api/construction-site.keys";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { useTranslation } from "react-i18next";

interface TransformedConstructionSitesData {
  columnDefs: GridColDef<ConstructionSite>[];
  rowDefs: ConstructionSite[];
}

export const useConstructionSites = () => {
  const { t } = useTranslation();

  const { data, error, isLoading } = useQuery<
    ConstructionSite[],
    Error,
    TransformedConstructionSitesData
  >({
    queryKey: constructionSitesKeys.list(),
    queryFn: ConstructionSiteApi.getAll,
    select: (rows): TransformedConstructionSitesData => {
      if (!rows?.length) return { columnDefs: [], rowDefs: [] };

      const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

      const columnDefs: GridColDef[] = allKeys.map((key) => {
        const headerName = t(`common.columns.${key}`, {
          defaultValue: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        });

        if (key === "constructionSiteEmployees") {
          return {
            field: key,
            headerName: t(
              "common.columns.constructionSiteEmployees",
              "Zaposlenici"
            ),
            width: 350,
            renderCell: (params) => {
              const employees = params.value;
              if (!Array.isArray(employees) || employees.length === 0)
                return "";
              return employees
                .map((e: any) => {
                  const name = `${e.firstName ?? ""} ${
                    e.lastName ?? ""
                  }`.trim();
                  const range =
                    e.dateFrom && e.dateTo ? `(${e.dateFrom}–${e.dateTo})` : "";
                  return `${name} ${range}`.trim();
                })
                .join(", ");
            },
          };
        }

        if (key === "constructionSiteTools") {
          return {
            field: key,
            headerName: t("common.columns.constructionSiteTools", "Alati"),
            width: 420,
            renderCell: (params) => {
              const tools = params.value;
              if (!Array.isArray(tools) || tools.length === 0) return "";
              return tools
                .map((t: any) => {
                  const title = t.name ?? t.model ?? t.description ?? "—";
                  const inv = t.inventoryNumber
                    ? ` (${t.inventoryNumber})`
                    : "";
                  const status = t.status ? ` – ${t.status}` : "";
                  const range =
                    t.dateFrom && t.dateTo ? ` ${t.dateFrom}–${t.dateTo}` : "";
                  return `${title}${inv}${status}${range}`;
                })
                .join("; ");
            },
          };
        }

        if (key === "constructionSiteVehicles") {
          return {
            field: key,
            headerName: t("common.columns.constructionSiteVehicles", "Vozila"),
            width: 500,
            renderCell: (params) => {
              const vehicles = params.value;
              if (!Array.isArray(vehicles) || vehicles.length === 0) return "";
              return vehicles
                .map((v: any) => {
                  const title =
                    v.name ??
                    [v.brand, v.model].filter(Boolean).join(" ") ??
                    "—";
                  const reg = v.registrationNumber
                    ? ` (${v.registrationNumber})`
                    : "";
                  const status = v.status ? ` – ${v.status}` : "";
                  const range =
                    v.dateFrom && v.dateTo ? ` ${v.dateFrom}–${v.dateTo}` : "";
                  return `${title}${reg}${status}${range}`;
                })
                .join("; ");
            },
          };
        }

        return {
          field: key,
          headerName,
          width: 180,
        };
      });

      const rowDefs = rows.map((r) => ({ ...r, id: r.id }));

      return { columnDefs, rowDefs };
    },
  });

  return {
    constructionSitesRows: data?.rowDefs ?? [],
    constructionSitesColumns: data?.columnDefs ?? [],
    error,
    isLoading,
  };
};
