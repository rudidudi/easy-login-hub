# Designfolio

AI-powered design generation. Describe your landing page in plain text and get a production-ready design created directly in Figma.

## How it works

1. **Connect** your Figma account via OAuth
2. **Describe** the landing page you want
3. **Generate** — Claude creates the design directly in your Figma file

## Architecture

| Component | Tech | Description |
|-----------|------|-------------|
| **Frontend** | React + Vite + TypeScript | Dashboard UI hosted on Lovable |
| **Agent Server** | Node.js + Express | Runs on Railway, orchestrates Claude API and Figma MCP |
| **Auth** | Supabase | User authentication (Google, GitHub, email) |
| **Design Tool** | Figma (via MCP) | Designs are created directly in the user's Figma account |
| **AI** | Anthropic Claude | Generates design layouts from text prompts |

## Local development

```bash
npm install
npm run dev
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_FIGMA_CLIENT_ID` | Figma OAuth app client ID |
| `VITE_FIGMA_REDIRECT_URI` | Figma OAuth redirect URI |

## Roadmap

- Figma MCP direct generation (waiting for third-party MCP support)
- Canvas support (coming soon)

## License

Private — all rights reserved.
