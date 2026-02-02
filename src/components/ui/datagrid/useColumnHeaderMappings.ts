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
      original: "siteManagerName",
      translated: t("common.columns.siteManagerName"),
    },
    { original: "ConstructionSiteEmployees", translated: t("common.columns.constructionSiteEmployees") },
    { original: "constructionSiteEmployees", translated: t("common.columns.constructionSiteEmployees") },
    { original: "ConstructionSiteTools", translated: t("common.columns.constructionSiteTools") },
    { original: "constructionSiteTools", translated: t("common.columns.constructionSiteTools") },
    { original: "ConstructionSiteVehicles", translated: t("common.columns.constructionSiteVehicles") },
    { original: "constructionSiteVehicles", translated: t("common.columns.constructionSiteVehicles") },
    { original: "ConstructionSiteCondos", translated: t("common.columns.constructionSiteCondos") },
    { original: "constructionSiteCondos", translated: t("common.columns.constructionSiteCondos") },
    { original: "CreatedDate", translated: t("common.columns.createdDate") },
    { original: "createdDate", translated: t("common.columns.createdDate") },
    { original: "ModifiedDate", translated: t("common.columns.modifiedDate") },
    { original: "modifiedDate", translated: t("common.columns.modifiedDate") },

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
    { original: "PhoneNumber", translated: t("common.columns.phoneNumber") },
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
    {
      original: "VehicleRegistrationNumber",
      translated: t("common.columns.registrationNumber"),
    },
    { original: "VehicleBrand", translated: t("common.columns.brand") },
    { original: "VehicleModel", translated: t("common.columns.model") },
    { original: "vehicleRegistrations", translated: t("common.columns.vehicleRegistrations") },
    { original: "VehicleRegistrations", translated: t("common.columns.vehicleRegistrations") },
    { original: "Vehicle Registrations", translated: t("common.columns.vehicleRegistrations") },
    { original: "vehicleInsurances", translated: t("common.columns.vehicleInsurances") },
    { original: "VehicleInsurances", translated: t("common.columns.vehicleInsurances") },
    { original: "Vehicle Insurances", translated: t("common.columns.vehicleInsurances") },

    // CONDO COLUMNS
    { original: "leasePaymentStatus", translated: t("common.columns.leasePaymentStatus") },
    { original: "LeasePaymentStatus", translated: t("common.columns.leasePaymentStatus") },
    { original: "LEASEPAYMENTSTATUS", translated: t("common.columns.leasePaymentStatus") },
    { original: "capacity", translated: t("common.columns.capacity") },
    { original: "Capacity", translated: t("common.columns.capacity") },
    { original: "currentlyOccupied", translated: t("common.columns.currentlyOccupied") },
    { original: "CurrentlyOccupied", translated: t("common.columns.currentlyOccupied") },
    { original: "pricePerDay", translated: t("common.columns.pricePerDay") },
    { original: "PricePerDay", translated: t("common.columns.pricePerDay") },
    { original: "pricePerMonth", translated: t("common.columns.pricePerMonth") },
    { original: "PricePerMonth", translated: t("common.columns.pricePerMonth") },
    { original: "leaseStartDate", translated: t("common.columns.leaseStartDate") },
    { original: "LeaseStartDate", translated: t("common.columns.leaseStartDate") },
    { original: "leaseEndDate", translated: t("common.columns.leaseEndDate") },
    { original: "LeaseEndDate", translated: t("common.columns.leaseEndDate") },
    { original: "employees", translated: t("common.columns.employees") },
    { original: "Employees", translated: t("common.columns.employees") },
    { original: "currency", translated: t("common.columns.currency") },
    { original: "Currency", translated: t("common.columns.currency") },
    { original: "address", translated: t("common.columns.address") },
    { original: "Address", translated: t("common.columns.address") },
    { original: "constructionSites", translated: t("common.columns.constructionSites") },
    { original: "ConstructionSites", translated: t("common.columns.constructionSites") },

    //  CONSTRUCTION / ASSIGNMENTS
    {
      original: "ConstructionSiteId",
      translated: t("common.columns.constructionSiteId"),
    },
    {
      original: "ConstructionSiteLocation",
      translated: t("common.columns.constructionSiteLocation"),
    },
    {
      original: "ConstructionSiteName",
      translated: t("common.columns.constructionSiteName"),
    },
    { original: "EmployeeId", translated: t("common.columns.employeeId") },
    {
      original: "SiteManagerPhoneNumber",
      translated: t("common.columns.siteManagerPhoneNumber"),
    },
    { original: "DateFrom", translated: t("common.columns.dateFrom") },
    { original: "DateTo", translated: t("common.columns.dateTo") },

    // EXAMINATION TYPES
    {
      original: "ExaminationTypeName",
      translated: t("common.columns.examinationTypeName"),
    },
    {
      original: "MonthsToNextExamination",
      translated: t("common.columns.monthsToNextExamination"),
    },

    {
      original: "ExaminationTypeName",
      translated: t("common.columns.examinationTypeName"),
    },
    {
      original: "MonthsToNextExamination",
      translated: t("common.columns.monthsToNextExamination"),
    },

    // MEDICAL EXAMINATIONS
    {
      original: "ExaminationTypeId",
      translated: t("common.columns.examinationTypeId"),
    },
    {
      original: "ExaminationDate",
      translated: t("common.columns.examinationDate"),
    },
    {
      original: "NextExaminationDate",
      translated: t("common.columns.nextExaminationDate"),
    },
    { original: "Result", translated: t("common.columns.result") },
    { original: "Note", translated: t("common.columns.note") },
    { original: "EmployeeOIB", translated: t("common.columns.employeeOib") },

    { original: "Address", translated: t("common.columns.address") },
    { original: "Capacity", translated: t("common.columns.capacity") },
    {
      original: "CurrentlyOccupied",
      translated: t("common.columns.currentlyOccupied"),
    },
    {
      original: "LeaseStartDate",
      translated: t("common.columns.leaseStartDate"),
    },
    {
      original: "LeaseEndDate",
      translated: t("common.columns.leaseEndDate"),
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
      original: "PricePerDay",
      translated: t("common.columns.pricePerDay"),
    },
    {
      original: "PricePerMonth",
      translated: t("common.columns.pricePerMonth"),
    },
    { original: "Currency", translated: t("common.columns.currency") },
    { original: "Notes", translated: t("common.columns.notes") },

    // VEHICLE REGISTRATIONS
    { original: "ValidFrom", translated: t("common.columns.validFrom") },
    { original: "ValidTo", translated: t("common.columns.validTo") },
    {
      original: "TotalCostAmount",
      translated: t("common.columns.totalCostAmount"),
    },
    { original: "CostCurrency", translated: t("common.columns.costCurrency") },
    {
      original: "RegistrationStationName",
      translated: t("common.columns.registrationStationName"),
    },
    {
      original: "RegistrationStationLocation",
      translated: t("common.columns.registrationStationLocation"),
    },
    { original: "ReportNumber", translated: t("common.columns.reportNumber") },
    { original: "DocumentPath", translated: t("common.columns.documentPath") },
    {
      original: "RegistrationValidFrom",
      translated: t("common.columns.registrationValidFrom"),
    },
    {
      original: "RegistrationValidTo",
      translated: t("common.columns.registrationValidTo"),
    },

    // VEHICLE INSURANCES
    { original: "Insurer", translated: t("common.columns.insurer") },
    { original: "PolicyNumber", translated: t("common.columns.policyNumber") },
    { original: "PolicyType", translated: t("common.columns.policyType") },
    { original: "CostAmount", translated: t("common.columns.costAmount") },
    { original: "CostCurrency", translated: t("common.columns.costCurrency") },
    { original: "ValidFrom", translated: t("common.columns.validFrom") },
    { original: "ValidTo", translated: t("common.columns.validTo") },
    { original: "DocumentPath", translated: t("common.columns.documentPath") },

    // VEHICLE BUSINESS TRIPS
    {
      original: "VehicleId",
      translated: t("common.columns.vehicleId"),
    },
    {
      original: "EmployeeId",
      translated: t("common.columns.employeeId"),
    },
    {
      original: "StartLocationText",
      translated: t("common.columns.startLocationText"),
    },
    {
      original: "EndLocationText",
      translated: t("common.columns.endLocationText"),
    },
    {
      original: "StartAt",
      translated: t("common.columns.startAt"),
    },
    {
      original: "EndAt",
      translated: t("common.columns.endAt"),
    },
    {
      original: "StartKilometers",
      translated: t("common.columns.startKilometers"),
    },
    {
      original: "EndKilometers",
      translated: t("common.columns.endKilometers"),
    },
    {
      original: "Refueled",
      translated: t("common.columns.refueled"),
    },
    {
      original: "FuelLiters",
      translated: t("common.columns.fuelLiters"),
    },
    {
      original: "FuelAmount",
      translated: t("common.columns.fuelAmount"),
    },
    {
      original: "FuelCurrency",
      translated: t("common.columns.fuelCurrency"),
    },
    {
      original: "TripStatus",
      translated: t("common.columns.tripStatus"),
    },
    {
      original: "Note",
      translated: t("common.columns.note"),
    },
    {
      original: "PurposeOfTrip",
      translated: t("common.columns.purposeOfTrip"),
    },
    {
      original: "ApprovedByEmployeeUserId",
      translated: t("common.columns.approvedByEmployeeUserId"),
    },
    {
      original: "ApprovedDate",
      translated: t("common.columns.approvedDate"),
    },
    {
      original: "RejectReason",
      translated: t("common.columns.rejectReason"),
    },
    {
      original: "TravelledKilometers",
      translated: t("common.columns.travelledKilometers"),
    },
    {
      original: "ApprovedByEmployeeName",
      translated: t("common.columns.approvedByEmployeeName"),
    },

    // CERTIFICATION TYPES
    {
      original: "CertificationTypeName",
      translated: t("common.columns.certificationTypeName"),
    },
    {
      original: "RequiresRenewal",
      translated: t("common.columns.requiresRenewal"),
    },
    {
      original: "MonthsToRenewal",
      translated: t("common.columns.monthsToRenewal"),
    },
    {
      original: "CreatedDate",
      translated: t("common.columns.createdDate"),
    },
    {
      original: "CreatedBy",
      translated: t("common.columns.createdBy"),
    },
    {
      original: "ModifiedDate",
      translated: t("common.columns.modifiedDate"),
    },
    {
      original: "ModifiedBy",
      translated: t("common.columns.modifiedBy"),
    },

    // CERTIFICATIONS (columns)
    { original: "EmployeeName", translated: t("common.columns.employeeName") },
    {
      original: "CertificationTypeId",
      translated: t("common.columns.certificationTypeId"),
    },
    {
      original: "CertificationDate",
      translated: t("common.columns.certificationDate"),
    },
    {
      original: "NextCertificationDate",
      translated: t("common.columns.nextCertificationDate"),
    },
    {
      original: "CertificatePath",
      translated: t("common.columns.certificatePath"),
    },
    {
      original: "ReminderSentDate",
      translated: t("common.columns.reminderSentDate"),
    },

    // Audit fields (your grid uses camelCase)
    { original: "createdDate", translated: t("common.columns.createdDate") },
    { original: "createdBy", translated: t("common.columns.createdBy") },
    { original: "modifiedDate", translated: t("common.columns.modifiedDate") },
    { original: "modifiedBy", translated: t("common.columns.modifiedBy") },

    // also keep these if other tables use PascalCase
    { original: "CreatedDate", translated: t("common.columns.createdDate") },
    { original: "CreatedBy", translated: t("common.columns.createdBy") },
    { original: "ModifiedDate", translated: t("common.columns.modifiedDate") },
    { original: "ModifiedBy", translated: t("common.columns.modifiedBy") },

    // MATERIALS
    {
      original: "UnitOfMeasure",
      translated: t("common.columns.unitOfMeasure"),
    },
    { original: "Quantity", translated: t("common.columns.quantity") },
    { original: "UnitPrice", translated: t("common.columns.unitPrice") },
    { original: "ArticleCode", translated: t("common.columns.articleCode") },
    { original: "Barcode", translated: t("common.columns.barcode") },

    // if your grid uses camelCase (your data fields do)
    {
      original: "unitOfMeasure",
      translated: t("common.columns.unitOfMeasure"),
    },
    { original: "quantity", translated: t("common.columns.quantity") },
    { original: "unitPrice", translated: t("common.columns.unitPrice") },
    { original: "articleCode", translated: t("common.columns.articleCode") },
    { original: "barcode", translated: t("common.columns.barcode") },

    // TOOL REPAIRS / TOOL SERVICES
    { original: "ToolId", translated: t("common.columns.tool") },
    { original: "RepairDate", translated: t("common.columns.serviceDate") },
    { original: "Cost", translated: t("common.columns.serviceCost") },
  ];
}
