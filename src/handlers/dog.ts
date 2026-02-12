/**
 * Dog API handler
 */

import type { Logger } from '../utils/logger';
import { sendJSON, sendError } from '../utils/response';
import { getRandomQuote } from '../data/quotes';

interface DogAPIResponse {
	message: string;
	status: string;
}

/**
 * Fetch random dog image and quote
 */
export async function getDogHandler(
	request: Request,
	env: Env,
	ctx: ExecutionContext,
	logger: Logger
): Promise<Response> {
	logger.info('Fetching random dog');

	try {
		// Fetch from Dog CEO API with timeout
		const timeout = parseInt(env.API_TIMEOUT_MS || '10000', 10);
		const dogResponse = await fetch('https://dog.ceo/api/breeds/image/random', {
			signal: AbortSignal.timeout(timeout),
		});

		if (!dogResponse.ok) {
			throw new Error(`Dog API returned ${dogResponse.status}`);
		}

		const dogData = (await dogResponse.json()) as DogAPIResponse;

		if (dogData.status !== 'success') {
			throw new Error('Dog API returned error status');
		}

		// Return dog image with random quote
		return sendJSON(
			{
				image: dogData.message,
				quote: getRandomQuote(),
			},
			{ cache: false }
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to fetch dog image';
		logger.error('Error fetching dog', { message });
		return sendError(500, message, logger);
	}
}
