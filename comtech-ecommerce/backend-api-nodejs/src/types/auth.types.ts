export interface User {
  id: number;
  email: string;
  role: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}