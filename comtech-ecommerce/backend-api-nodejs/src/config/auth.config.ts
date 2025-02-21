import dotenv from 'dotenv';
dotenv.config();

export const AUTH_CONFIG = {
 JWT_SECRET: process.env.JWT_SECRET ?? throwError('JWT_SECRET'),
 JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? throwError('JWT_REFRESH_SECRET'),
 ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES ?? '15m',  
 REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES ?? '7d'
};

function throwError(variable: string): never {
 throw new Error(`${variable} must be set in environment variables`);
}