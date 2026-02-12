# Deployment Guide

This guide walks you through deploying Dog-a-Day to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com/sign-up
2. **Node.js**: Version 18 or higher
3. **pnpm**: Install with `npm install -g pnpm`

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

## Step 3: Test Locally

Before deploying, test the application locally:

```bash
pnpm dev
```

Visit http://localhost:8787 to verify everything works.

## Step 4: Deploy to Production

### First Deployment

```bash
pnpm deploy
```

This will:
1. Build your TypeScript code
2. Upload to Cloudflare Workers
3. Provide you with a URL like `https://dog-a-day.<your-subdomain>.workers.dev`

### Deploy to Specific Environment

```bash
# Deploy to production environment
pnpm deploy --env production

# Deploy to staging environment
pnpm deploy --env staging
```

## Step 5: Configure Custom Domain (Optional)

### Via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Select your account
3. Go to **Workers & Pages**
4. Click on your **dog-a-day** worker
5. Go to **Settings** → **Triggers**
6. Click **Add Custom Domain**
7. Enter your domain (e.g., `dogs.example.com`)
8. Click **Add Custom Domain**

### Via wrangler.jsonc

Add routes to your `wrangler.jsonc`:

```jsonc
{
  "routes": [
    {
      "pattern": "dogs.example.com/*",
      "zone_name": "example.com"
    }
  ]
}
```

Then deploy:

```bash
pnpm deploy
```

## Step 6: Monitor Your Deployment

### View Logs

```bash
npx wrangler tail
```

This streams real-time logs from your worker.

### View Analytics

1. Go to https://dash.cloudflare.com
2. Select **Workers & Pages**
3. Click on **dog-a-day**
4. View metrics: requests, errors, CPU time, etc.

## Environment Variables

Configure environment-specific variables in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "LOG_LEVEL": "info",
    "API_TIMEOUT_MS": "10000"
  },
  "env": {
    "production": {
      "vars": {
        "LOG_LEVEL": "warn"
      }
    }
  }
}
```

## Updating Your Deployment

After making changes:

```bash
# Test locally first
pnpm dev

# Deploy updates
pnpm deploy
```

## Rollback

If you need to rollback to a previous version:

```bash
# List deployments
npx wrangler deployments list

# Rollback to a specific deployment
npx wrangler rollback [deployment-id]
```

## Performance Optimization

### Enable Smart Placement

Uncomment in `wrangler.jsonc`:

```jsonc
{
  "placement": { "mode": "smart" }
}
```

This automatically routes requests to the optimal Cloudflare location.

### Caching Strategy

For production, you can enable HTML caching by modifying `src/handlers/home.ts`:

```typescript
const cache = true; // Enable caching
return sendHTML(getLandingPageHTML(), { cache });
```

## Troubleshooting

### Error: "No such command: deploy"

Update wrangler:
```bash
pnpm add -D wrangler@latest
```

### Error: "Authentication required"

Login again:
```bash
npx wrangler logout
npx wrangler login
```

### Error: "Worker size exceeds limit"

Check your bundle size:
```bash
npx wrangler deploy --dry-run --outdir=dist
```

Workers have a 1MB limit (10MB with paid plan).

### Error: "API timeout"

Increase timeout in `wrangler.jsonc`:
```jsonc
{
  "vars": {
    "API_TIMEOUT_MS": "30000"
  }
}
```

## Cost

Cloudflare Workers Free Tier includes:
- 100,000 requests/day
- 10ms CPU time per request
- Unlimited bandwidth

For higher usage, see: https://developers.cloudflare.com/workers/platform/pricing/

## Security

### Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// In src/index.ts
const rateLimiter = new Map<string, number>();

// Check rate limit before processing
const ip = request.headers.get('cf-connecting-ip') || 'unknown';
const count = rateLimiter.get(ip) || 0;
if (count > 100) {
  return new Response('Rate limit exceeded', { status: 429 });
}
rateLimiter.set(ip, count + 1);
```

### CORS Configuration

CORS is already configured in `src/utils/response.ts`. Modify if needed:

```typescript
'Access-Control-Allow-Origin': '*', // Change to specific domain
```

## Monitoring & Alerts

### Set up Alerts

1. Go to Cloudflare Dashboard
2. **Account Home** → **Notifications**
3. Create alerts for:
   - High error rates
   - CPU time exceeded
   - Request volume spikes

### Integrate with External Monitoring

Use Workers Analytics Engine or integrate with services like:
- Sentry
- Datadog
- New Relic

## Next Steps

- Set up CI/CD with GitHub Actions
- Add automated tests
- Configure custom domain
- Set up monitoring alerts
- Implement caching strategy

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
