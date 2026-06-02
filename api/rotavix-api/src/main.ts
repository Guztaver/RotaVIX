import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Response } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { SpaFallbackFilter } from './spa-fallback.filter';

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
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) => {
          const constraints = err.constraints ? Object.values(err.constraints) : [];
          if (constraints.length > 0) { return constraints; }
          const childrenMsgs =
            err.children?.flatMap((child) =>
              child.constraints ? Object.values(child.constraints) : [],
            ) ?? [];
          return childrenMsgs.length > 0 ? childrenMsgs : [`Campo "${err.property}" inválido.`];
        });
        // Return a BadRequestException with a single formatted message string
        const { BadRequestException } = require('@nestjs/common');
        return new BadRequestException({
          statusCode: 400,
          error: 'Erro de validação',
          message: messages.length === 1 ? messages[0] : messages,
        });
      },
    }),
  );

  // ── Serve Angular static files (production monolith) ──────────────
  const webDistPath =
    process.env.WEB_DIST_PATH ||
    join(__dirname, '..', '..', '..', 'web', 'rotavix-web', 'dist', 'rotavix-web', 'browser');

  if (existsSync(webDistPath)) {
    // Static assets – JS, CSS, images, fonts, etc.
    app.useStaticAssets(webDistPath, {
      index: false,
      setHeaders: (res: Response, filePath: string) => {
        if (/\.(?:js|css|png|jpe?g|gif|ico|svg|woff2?|ttf|eot)$/.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    });

    // SPA fallback — serve index.html for unmatched non-API GET requests
    app.useGlobalFilters(new SpaFallbackFilter(webDistPath));
  }

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
