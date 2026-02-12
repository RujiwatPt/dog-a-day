/**
 * Router for handling HTTP requests
 */

import type { Logger } from './utils/logger';
import { sendError } from './utils/response';
import { homePageHandler } from './handlers/home';
import { getDogHandler } from './handlers/dog';

type RouteHandler = (
	request: Request,
	env: Env,
	ctx: ExecutionContext,
	logger: Logger
) => Promise<Response>;

interface Route {
	method: string;
	pattern: string;
	handler: RouteHandler;
}

/**
 * Simple router implementation
 */
export class Router {
	private routes: Route[] = [];

	/**
	 * Register a route
	 */
	register(method: string, pattern: string, handler: RouteHandler): void {
		this.routes.push({
			method: method.toUpperCase(),
			pattern,
			handler,
		});
	}

	/**
	 * Match route pattern
	 */
	private matchRoute(path: string, pattern: string): boolean {
		if (pattern === path) return true;
		if (pattern.endsWith('/*')) {
			const base = pattern.slice(0, -2);
			return path.startsWith(base + '/') || path === base;
		}
		return false;
	}

	/**
	 * Handle incoming request
	 */
	async handle(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
		logger: Logger
	): Promise<Response> {
		const url = new URL(request.url);
		const method = request.method.toUpperCase();

		// Find matching route
		for (const route of this.routes) {
			if (route.method === method && this.matchRoute(url.pathname, route.pattern)) {
				return await route.handler(request, env, ctx, logger);
			}
		}

		// No route found
		logger.warn('Route not found', { method, pathname: url.pathname });
		return sendError(404, `Not Found: ${method} ${url.pathname}`, logger);
	}
}

/**
 * Create and configure router
 */
export function createRouter(): Router {
	const router = new Router();

	// Public routes
	router.register('GET', '/', homePageHandler);
	router.register('GET', '/api/dog', getDogHandler);

	// Wrangler internal routes (dev mode only)
	router.register('GET', '/cdn-cgi/ProxyWorker/pause', healthCheck);
	router.register('GET', '/cdn-cgi/ProxyWorker/play', healthCheck);

	return router;
}

/**
 * Health check handler for Wrangler
 */
async function healthCheck(): Promise<Response> {
	return new Response('OK', { status: 200 });
}
