export type LoginRequest = { username: string; password: string };

export type ApiResponse<T> = {
  jwt: string | PromiseLike<string | null> | null;
  data: T;
  isSuccessfull: boolean;
  messages: string[];
};

export type TokenResponse = {
  jwt: string;
  refreshToken: string;
  refreshTokenExpirationDate?: string;
};
