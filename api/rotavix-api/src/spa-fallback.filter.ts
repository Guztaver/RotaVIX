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

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // API routes: return the actual exception message, not a generic "Not Found"
    if (req.path.startsWith('/api/')) {
      const response = exception.getResponse();
      const message =
        typeof response === 'object' && response !== null
          ? ((response as Record<string, unknown>)['message'] ?? response)
          : response;
      return res.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: message || 'Not Found',
      });
    }

    // SPA fallback — serve index.html for client-side routes
    if (req.method === 'GET') {
      return res.sendFile(join(this.webDistPath, 'index.html'), (err) => {
        if (err) {
          res.status(404).json({ statusCode: 404, message: 'Not Found' });
        }
      });
    }

    // Non-GET requests to non-API paths → 404
    return res.status(404).json({ statusCode: 404, message: 'Not Found' });
  }
}
