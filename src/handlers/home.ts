/**
 * Home page handler
 */

import type { Logger } from '../utils/logger';
import { sendHTML } from '../utils/response';
import { getLandingPageHTML } from '../views/landing';

export async function homePageHandler(
	request: Request,
	env: Env,
	ctx: ExecutionContext,
	logger: Logger
): Promise<Response> {
	logger.info('Serving home page');
	
	// In production, you might want to cache this
	const cache = env.LOG_LEVEL === 'warn'; // production mode
	
	return sendHTML(getLandingPageHTML(), { cache });
}
