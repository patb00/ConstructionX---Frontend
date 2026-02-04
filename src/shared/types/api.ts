export type ApiEnvelope<T> = {
  data: T;
  messages: string[];
  isSuccessfull: boolean;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
