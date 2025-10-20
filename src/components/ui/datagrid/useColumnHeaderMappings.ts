import { useTranslation } from "react-i18next";

type MapItem = { original: string; translated: string };

export default function useColumnHeaderMappings(): MapItem[] {
  const { t } = useTranslation();

  return [
    // COMMON BASIC
    { original: "Id", translated: t("common.columns.id") },
    { original: "Name", translated: t("common.columns.name") },
    { original: "Description", translated: t("common.columns.description") },
    { original: "Actions", translated: t("common.columns.actions") },

    // CONSTRUCTION SITES
    { original: "Location", translated: t("common.columns.location") },
    { original: "StartDate", translated: t("common.columns.startDate") },
    {
      original: "PlannedEndDate",
      translated: t("common.columns.plannedEndDate"),
    },
    {
      original: "SiteManagerId",
      translated: t("common.columns.siteManagerId"),
    },
    {
      original: "SiteManagerName",
      translated: t("common.columns.siteManagerName"),
    },
    {
      original: "ConstructionSiteTools",
      translated: t("common.columns.constructionSiteTools"),
    },
    {
      original: "ConstructionSiteEmployees",
      translated: t("common.columns.constructionSiteEmployees"),
    },
    { original: "CreatedDate", translated: t("common.columns.createdDate") },
    { original: "CreatedBy", translated: t("common.columns.createdBy") },
    { original: "ModifiedDate", translated: t("common.columns.modifiedDate") },
    { original: "ModifiedBy", translated: t("common.columns.modifiedBy") },

    // TENANTS
    { original: "Identifier", translated: t("common.columns.identifier") },
    {
      original: "ConnectionString",
      translated: t("common.columns.connectionString"),
    },
    { original: "Email", translated: t("common.columns.email") },
    { original: "FirstName", translated: t("common.columns.firstName") },
    { original: "LastName", translated: t("common.columns.lastName") },
    { original: "ValidUpToDate", translated: t("common.columns.validUntil") },
    { original: "IsActive", translated: t("common.columns.isActive") },

    // COMPANIES
    {
      original: "DateOfCreation",
      translated: t("common.columns.dateOfCreation"),
    },

    // ROLES
    { original: "Permissions", translated: t("common.columns.permissions") },

    // USERS
    { original: "UserName", translated: t("common.columns.userName") },

    // EMPLOYEES
    { original: "Oib", translated: t("common.columns.oib") },
    { original: "DateOfBirth", translated: t("common.columns.dateOfBirth") },
    {
      original: "EmploymentDate",
      translated: t("common.columns.employmentDate"),
    },
    {
      original: "TerminationDate",
      translated: t("common.columns.terminationDate"),
    },
    {
      original: "HasMachineryLicense",
      translated: t("common.columns.hasMachineryLicense"),
    },
    { original: "ClothingSize", translated: t("common.columns.clothingSize") },
    { original: "GloveSize", translated: t("common.columns.gloveSize") },
    { original: "ShoeSize", translated: t("common.columns.shoeSize") },
    { original: "JobPosition", translated: t("common.columns.jobPosition") },

    // TOOL COLUMNS
    {
      original: "InventoryNumber",
      translated: t("common.columns.inventoryNumber"),
    },
    { original: "SerialNumber", translated: t("common.columns.serialNumber") },
    { original: "Manufacturer", translated: t("common.columns.manufacturer") },
    { original: "Model", translated: t("common.columns.model") },
    { original: "PurchaseDate", translated: t("common.columns.purchaseDate") },
    {
      original: "PurchasePrice",
      translated: t("common.columns.purchasePrice"),
    },
    { original: "Status", translated: t("common.columns.status") },
    { original: "Condition", translated: t("common.columns.condition") },
    {
      original: "ToolCategoryId",
      translated: t("common.columns.toolCategoryId"),
    },
    {
      original: "ToolCategoryName",
      translated: t("common.columns.toolCategoryName"),
    },
    {
      original: "ResponsibleEmployeeId",
      translated: t("common.columns.responsibleEmployeeId"),
    },
    {
      original: "ResponsibleEmployeeName",
      translated: t("common.columns.responsibleEmployeeName"),
    },
    {
      original: "ResponsibleEmployeeJobPosition",
      translated: t("common.columns.responsibleEmployeeJobPosition"),
    },

    // VEHICLE COLUMNS (NEW)
    {
      original: "RegistrationNumber",
      translated: t("common.columns.registrationNumber"),
    },
    { original: "Vin", translated: t("common.columns.vin") },
    { original: "Brand", translated: t("common.columns.brand") },
    {
      original: "YearOfManufacturing",
      translated: t("common.columns.yearOfManufacturing"),
    },
    { original: "VehicleType", translated: t("common.columns.vehicleType") },
    { original: "HorsePower", translated: t("common.columns.horsePower") },
    {
      original: "AverageConsumption",
      translated: t("common.columns.averageConsumption"),
    },
    { original: "Weight", translated: t("common.columns.weight") },
  ];
}
