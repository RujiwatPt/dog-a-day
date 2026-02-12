# 🐕 Dog-a-Day

A modern, clean landing page that displays random dog photos with motivational quotes. Built with Cloudflare Workers for global edge deployment.

## Features

- 🎨 Modern, responsive design
- 🐶 Random dog photos from [Dog CEO API](https://dog.ceo/dog-api/)
- 💬 Motivational quotes to brighten your day
- ⚡ Lightning-fast global delivery via Cloudflare Workers
- 🚫 No caching issues - fresh dogs every time
- 📱 Mobile-friendly interface

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **API**: Dog CEO API
- **Deployment**: Wrangler CLI

## Project Structure

```
src/
├── index.ts              # Main worker entry point
├── router.ts             # HTTP router
├── handlers/
│   ├── home.ts          # Home page handler
│   └── dog.ts           # Dog API handler
├── utils/
│   ├── logger.ts        # Logging utility
│   └── response.ts      # Response helpers
├── views/
│   └── landing.ts       # Landing page HTML
└── data/
    └── quotes.ts        # Motivational quotes
```

## Development

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- Cloudflare account (for deployment)

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

3. Open http://localhost:8787 in your browser

### Development Commands

```bash
pnpm dev          # Start local dev server
pnpm deploy       # Deploy to Cloudflare Workers
pnpm test         # Run tests
pnpm cf-typegen   # Generate TypeScript types
```

## Deployment

### Deploy to Cloudflare Workers

1. Login to Cloudflare:
```bash
npx wrangler login
```

2. Deploy:
```bash
pnpm deploy
```

3. Your app will be live at `https://dog-a-day.<your-subdomain>.workers.dev`

### Environment Configuration

The app uses environment variables configured in `wrangler.jsonc`:

- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `API_TIMEOUT_MS`: Timeout for external API calls (default: 10000ms)

### Production Environment

Deploy to production environment:
```bash
pnpm deploy --env production
```

## Configuration

### wrangler.jsonc

Key configuration options:

```jsonc
{
  "name": "dog-a-day",
  "main": "src/index.ts",
  "compatibility_date": "2026-02-10",
  "vars": {
    "API_TIMEOUT_MS": "10000",
    "LOG_LEVEL": "info"
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

## Architecture

### Request Flow

1. User visits the landing page
2. Browser fetches `/` (HTML page)
3. JavaScript loads and calls `/api/dog`
4. Worker fetches random dog from Dog CEO API
5. Worker returns dog image URL + random quote
6. Browser displays dog and quote

### Caching Strategy

- **HTML Page**: No cache in dev, can be cached in production
- **API Endpoint**: Never cached (always fresh data)
- **Dog Images**: Cache-busted with query parameters

### Error Handling

- API timeout protection (10s default)
- Image load timeout (10s)
- Graceful error messages
- Race condition prevention

## Performance

- **Global Edge Network**: Deployed to 300+ Cloudflare locations
- **Cold Start**: < 10ms
- **Response Time**: < 100ms (excluding external API)
- **Bandwidth**: Unlimited on Cloudflare Workers

## API Endpoints

### GET /

Returns the landing page HTML.

### GET /api/dog

Returns a random dog image with a motivational quote.

**Response:**
```json
{
  "image": "https://images.dog.ceo/breeds/...",
  "quote": "Every dog has its day, and today is yours!"
}
```

## Customization

### Adding More Quotes

Edit `src/data/quotes.ts`:

```typescript
const motivationalQuotes = [
  "Your custom quote here",
  // ... more quotes
];
```

### Styling

Modify the CSS in `src/views/landing.ts` to customize the appearance.

### Using Different Dog API

Replace the API call in `src/handlers/dog.ts`:

```typescript
const dogResponse = await fetch('YOUR_API_URL', {
  signal: AbortSignal.timeout(timeout),
});
```

## Troubleshooting

### Dev server shows old content

Do a hard refresh in your browser:
- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

### Button not working

Check browser console for errors. The app includes race condition prevention and proper error handling.

### Deployment fails

1. Ensure you're logged in: `npx wrangler login`
2. Check your Cloudflare account has Workers enabled
3. Verify `wrangler.jsonc` configuration

## License

MIT

## Credits

- Dog images from [Dog CEO API](https://dog.ceo/dog-api/)
- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
