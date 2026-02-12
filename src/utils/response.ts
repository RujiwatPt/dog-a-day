/**
 * Response utilities
 */

import type { Logger } from './logger';

/**
 * Send error response
 */
export function sendError(status: number, message: string, logger: Logger): Response {
	logger.error(`HTTP ${status}`, { message });

	return new Response(
		JSON.stringify({
			error: message,
			status,
		}),
		{
			status,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		}
	);
}

/**
 * Send JSON response
 */
export function sendJSON<T>(data: T, options?: { status?: number; cache?: boolean }): Response {
	const status = options?.status ?? 200;
	const cache = options?.cache ?? false;

	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': cache
				? 'public, max-age=3600'
				: 'no-store, no-cache, must-revalidate, proxy-revalidate',
			...(cache ? {} : { Pragma: 'no-cache', Expires: '0' }),
		},
	});
}

/**
 * Send HTML response
 */
export function sendHTML(html: string, options?: { cache?: boolean }): Response {
	const cache = options?.cache ?? false;

	return new Response(html, {
		status: 200,
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': cache
				? 'public, max-age=3600'
				: 'no-store, no-cache, must-revalidate',
			...(cache ? {} : { Pragma: 'no-cache', Expires: '0' }),
		},
	});
}
