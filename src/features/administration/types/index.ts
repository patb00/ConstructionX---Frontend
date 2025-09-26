export type TenantId = string;

export type Tenant = {
  id: TenantId;
  identifier: string;
  name: string;
  connectionString: string;
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
  validUpToDate: string;
  isActive: boolean;
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
