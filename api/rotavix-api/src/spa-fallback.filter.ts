import {
  Catch,
  NotFoundException,
  type ExceptionFilter,
  type ArgumentsHost,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { join } from 'node:path';

/**
 * Catches 404s (NotFoundException) for non-API GET requests and serves the
 * Angular index.html so client-side routing can take over (SPA fallback).
 */
@Catch(NotFoundException)
export class SpaFallbackFilter implements ExceptionFilter {
  constructor(private readonly webDistPath: string) {}

  catch(_exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // API routes should get a proper JSON 404 — don't serve index.html
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found',
      });
    }

    // SPA fallback — serve index.html for client-side routes
    if (req.method === 'GET') {
      return res.sendFile(join(this.webDistPath, 'index.html'), (err) => {
        if (err) {
          // If index.html doesn't exist, fall back to plain 404
          res.status(404).json({ statusCode: 404, message: 'Not Found' });
        }
      });
    }

    // Non-GET requests (POST, PUT, etc.) to non-API paths → 404
    return res.status(404).json({ statusCode: 404, message: 'Not Found' });
  }
}
