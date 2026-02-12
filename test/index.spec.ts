import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Worker', () => {
	it('responds with 200 on GET / (unit style)', async () => {
		const request = new IncomingRequest('http://example.com/');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		const data = (await response.json()) as Record<string, unknown>;
		expect(data).toHaveProperty('status', 'ok');
		expect(data).toHaveProperty('timestamp');
	});

	it('responds with 404 on unknown route', async () => {
		const request = new IncomingRequest('http://example.com/nonexistent');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(404);
		const data = (await response.json()) as Record<string, unknown>;
		expect(data).toHaveProperty('error');
	});

	it('returns proper content-type headers', async () => {
		const request = new IncomingRequest('http://example.com/');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.headers.get('content-type')).toBe('application/json');
		expect(response.headers.get('access-control-allow-origin')).toBe('*');
	});

	it('responds with 200 on GET / (integration style)', async () => {
		const response = await SELF.fetch('https://example.com/');
		expect(response.status).toBe(200);
		const data = (await response.json()) as Record<string, unknown>;
		expect(data).toHaveProperty('status', 'ok');
	});
});
