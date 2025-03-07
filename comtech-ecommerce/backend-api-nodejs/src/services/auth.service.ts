import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../config/auth.config';
import { AuthTokens, TokenPayload, User } from '../types/auth.types';
import * as metrics from '../config/metrics.config';
import ms from 'ms';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, password: string, role: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const startTime = process.hrtime();
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role as Role
        },
      });

      metrics.authenticationAttempts.inc({ status: 'success' });
      const tokens = await this.generateTokens(user);
      
      // Record request duration
      const [seconds, nanoseconds] = process.hrtime(startTime);
      metrics.httpRequestDurationMicroseconds
        .labels('POST', '/auth/register', '200')
        .observe(seconds + nanoseconds / 1e9);
      
      return tokens;
    }
    catch (error: any) {
      const startTime = process.hrtime();
      const [seconds, nanoseconds] = process.hrtime(startTime);
      metrics.httpRequestDurationMicroseconds
        .labels('POST', '/auth/register', '400')
        .observe(seconds + nanoseconds / 1e9);
      throw error;
    }
  }
  
  async login(email: string, password: string) {
    const startTime = process.hrtime();
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        metrics.authenticationAttempts.inc({ status: 'failure' });
        throw new Error('User not found');
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        metrics.authenticationAttempts.inc({ status: 'failure' });
        throw new Error('Invalid password');
      }
  
      metrics.authenticationAttempts.inc({ status: 'success' });
      const tokens = await this.generateTokens(user);
      
      const [seconds, nanoseconds] = process.hrtime(startTime);
      metrics.httpRequestDurationMicroseconds
        .labels('POST', '/auth/login', '200')
        .observe(seconds + nanoseconds / 1e9);
      
      return tokens;
    } catch (error) {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      metrics.httpRequestDurationMicroseconds
        .labels('POST', '/auth/login', '400')
        .observe(seconds + nanoseconds / 1e9);
      throw error;
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        AUTH_CONFIG.JWT_REFRESH_SECRET
      ) as TokenPayload;

      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
        },
      });

      if (!storedToken) {
        throw new Error('Invalid refresh token');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const userRole = user.role;

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(
      payload,
      AUTH_CONFIG.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      payload, 
      AUTH_CONFIG.JWT_REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    const refreshTokenExpiry = ms('7d');
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + refreshTokenExpiry),
      },
    });

    return { userRole, accessToken, refreshToken };
  }
}