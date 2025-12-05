export type TenantId = string;

export type Tenant = {
  id: string;
  identifier: string;
  name: string;
  connectionString: string | null;
  email: string;
  firstName: string;
  lastName: string;
  validUpToDate: string;
  isActive: boolean;
  oib: string;
  vatNumber: string;
  registrationNumber: string;
  companyCode: string;
  contactPhone: string;
  websiteUrl: string;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  defaultLanguage: string;
  logoFileName: string;
  notes: string;
};

export type NewTenantRequest = {
  identifier: string;
  name: string;
  connectionString: string | null;
  email: string;
  firstName: string;
  lastName: string;
  validUpToDate?: string | null;
  isActive: boolean;
  oib?: string | null;
  vatNumber?: string | null;
  registrationNumber?: string | null;
  companyCode?: string | null;
  contactPhone?: string | null;
  websiteUrl?: string | null;
  addressStreet?: string | null;
  addressPostalCode?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressCountry?: string | null;
  defaultLanguage?: string | null;
};

export type UpdateTenantRequest = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  oib: string;
  vatNumber: string;
  registrationNumber: string;
  companyCode: string;
  contactPhone: string;
  websiteUrl: string;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  defaultLanguage: string;
  notes: string;
};

export type UpdateSubscriptionRequest = {
  tenantId: TenantId;
  newExpirationDate: string;
};

export type ApiEnvelope<T> = {
  data: T;
  messages: string[];
  isSuccessfull: boolean;
};
