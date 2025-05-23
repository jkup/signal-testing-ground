# Signals Testing Playground - Web App

Interactive web playground for testing JavaScript signals across multiple frameworks.

## Features

- **Monaco Editor** with syntax highlighting
- **7 Signal Frameworks** supported:
  - Preact Signals
  - Vue Reactivity
  - SolidJS Signals
  - Alien Signals
  - Signia
  - Angular Signals
  - TC39 Signals (polyfill)
- **Real-time execution** with performance metrics
- **Pre-built examples** showcasing different patterns
- **Responsive design** with dark theme

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

### Option 1: Direct Upload

1. Build the project: `npm run build`
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Create a new project
4. Upload the `dist` folder

### Option 2: Git Integration

1. Push this code to a GitHub/GitLab repository
2. Connect the repository to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `web-app` (if in monorepo)

### Option 3: Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=signal-playground
```

## Project Structure

```
web-app/
├── src/
│   ├── main.ts              # Main application entry
│   ├── examples.ts          # Code examples
│   ├── frameworks/          # Framework implementations
│   └── types/               # TypeScript types
├── public/
│   └── _redirects          # Cloudflare Pages redirects
├── dist/                    # Built files (generated)
└── wrangler.toml           # Cloudflare configuration
```

## Browser Compatibility

Works in all modern browsers that support:

- ES2020+ features
- Web Workers
- Monaco Editor requirements
