/**
 * Dog-a-Day Cloudflare Worker
 * 
 * A simple, modern landing page that displays random dog photos
 * with motivational quotes.
 * 
 * Deploy: npm run deploy
 * Dev: npm run dev
 */

import { createRouter } from './router';
import { createLogger } from './utils/logger';
import { sendError } from './utils/response';

/**
 * Main fetch handler
 */
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const logger = createLogger(env.LOG_LEVEL || 'info');
		const router = createRouter();

		try {
			const url = new URL(request.url);
			const method = request.method.toUpperCase();

			logger.info(`${method} ${url.pathname}`, {
				userAgent: request.headers.get('user-agent'),
				ip: request.headers.get('cf-connecting-ip'),
			});

			// Handle CORS preflight
			if (method === 'OPTIONS') {
				return new Response(null, {
					status: 204,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type',
					},
				});
			}

			// Route request
			const response = await router.handle(request, env, ctx, logger);
			logger.info(`Response sent`, { status: response.status });
			return response;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			logger.error('Unhandled error', { message, stack: error instanceof Error ? error.stack : undefined });
			return sendError(500, 'Internal Server Error', logger);
		}
	},
} satisfies ExportedHandler<Env>;
