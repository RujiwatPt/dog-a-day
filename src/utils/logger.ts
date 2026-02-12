/**
 * Logger utility for structured logging
 */

export interface Logger {
	debug: (msg: string, data?: Record<string, unknown>) => void;
	info: (msg: string, data?: Record<string, unknown>) => void;
	warn: (msg: string, data?: Record<string, unknown>) => void;
	error: (msg: string, data?: Record<string, unknown>) => void;
}

/**
 * Create a logger instance
 */
export function createLogger(logLevel: string): Logger {
	const levels = { debug: 0, info: 1, warn: 2, error: 3 };
	const currentLevel = levels[logLevel as keyof typeof levels] ?? 1;

	return {
		debug: (msg: string, data?: Record<string, unknown>) =>
			currentLevel <= 0 && console.log('[DEBUG]', msg, data),
		info: (msg: string, data?: Record<string, unknown>) =>
			currentLevel <= 1 && console.log('[INFO]', msg, data),
		warn: (msg: string, data?: Record<string, unknown>) =>
			currentLevel <= 2 && console.log('[WARN]', msg, data),
		error: (msg: string, data?: Record<string, unknown>) =>
			currentLevel <= 3 && console.error('[ERROR]', msg, data),
	};
}
