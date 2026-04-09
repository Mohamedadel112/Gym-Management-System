import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Req, Res, Next, Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { createServer as createViteServer } from 'vite';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from './src/server/prisma.service.ts';
import { AuthService } from './src/server/auth.service.ts';
import { AuthController } from './src/server/auth.controller.ts';
import { GymController } from './src/server/gym.controller.ts';
import { AdminController } from './src/server/admin.controller.ts';
import { PaymentsService } from './src/server/payments.service.ts';
import { PaymentsController } from './src/server/payments.controller.ts';
import { GoogleStrategy } from './src/server/google.strategy.ts';
import { Reflector } from '@nestjs/core';

// Roles Decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.includes(user?.role);
  }
}

@Injectable()
export class EmailService {
  async sendVerificationEmail(email: string, token: string) {
    console.log(`[Email] Sending verification to ${email}: token=${token}`);
    // Real implementation would use nodemailer
  }
}

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, GymController, AdminController, PaymentsController],
  providers: [PrismaService, AuthService, RolesGuard, PaymentsService, EmailService, GoogleStrategy],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = 3000;

  app.setGlobalPrefix('api');
  app.enableCors();

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Use express.static directly from the app instance
    app.use(path.join('/'), (req: any, res: any, next: any) => {
      if (req.path.startsWith('/api')) {
        next();
      } else {
        // Simple static serving for production
        const fs = require('fs');
        const filePath = path.join(distPath, req.path === '/' ? 'index.html' : req.path);
        if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
          res.sendFile(filePath);
        } else {
          res.sendFile(path.join(distPath, 'index.html'));
        }
      }
    });
  }

  await app.listen(PORT, '0.0.0.0');
  console.log(`Server running on http://localhost:${PORT}`);
}

bootstrap();
