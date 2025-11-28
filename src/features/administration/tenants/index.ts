export type TenantId = string;

export type Tenant = {
  identifier: string;
  name: string;
  connectionString: string | null;
  email: string;
  firstName: string;
  lastName: string;
  validUpToDate: string;
  isActive: boolean;
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
