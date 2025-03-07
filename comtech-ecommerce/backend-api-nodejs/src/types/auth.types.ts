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
  userRole: string,
  accessToken: string;
  refreshToken: string;
}