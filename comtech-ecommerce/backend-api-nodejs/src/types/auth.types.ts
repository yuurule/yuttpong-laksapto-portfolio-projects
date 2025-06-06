export interface User {
  id: number;
  email: string;
  displayName: string;
  role: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthTokens {
  userInfo: {
    id: number;
    displayName: string;
    role: string;
  },
  accessToken: string;
  refreshToken: string;
}

export interface Customer {
  id: number;
  email: string;
  displayName: string;
}

export interface CustomerTokenPayload {
  customerId: number;
  email: string;
  displayName: string;
}

export interface CustomerAuthTokens {
  user: {
    id: number;
    displayName: string;
  },
  accessToken: string;
  refreshToken: string;
}