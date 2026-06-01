import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response, NextFunction } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:4200').split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Serve Angular static files (production monolith) ──────────────
  const webDistPath =
    process.env.WEB_DIST_PATH ||
    join(
      __dirname,
      '..',
      '..',
      '..',
      'web',
      'rotavix-web',
      'dist',
      'rotavix-web',
      'browser',
    );

  if (existsSync(webDistPath)) {
    // Static assets – JS, CSS, images, fonts, etc.
    app.useStaticAssets(webDistPath, {
      index: false,
      setHeaders: (res: Response, filePath: string) => {
        if (
          /\.(?:js|css|png|jpe?g|gif|ico|svg|woff2?|ttf|eot)$/.test(filePath)
        ) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    });

    // SPA fallback – serve index.html for all non-API GET requests
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      if (req.method === 'GET') {
        return res.sendFile(join(webDistPath, 'index.html'), (err) => {
          if (err) {
            next();
          }
        });
      }
      next();
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
