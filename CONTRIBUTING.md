# Contributing

Thanks for your interest in this project. Please note that **contributions may not be accepted** — this is a personal project and I may decline pull requests without explanation. That said, feel free to fork the repo and adapt it for your own use.

If you do want to submit a change, here's how to set the project up locally.

## Requirements

- Node.js >= 22.12.0
- npm

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/myles/clippings-myles-garden.git
cd clippings-myles-garden
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Copy the sample env file and fill in your values:

```bash
cp .env.sample .env
```

| Variable | Required | Description |
|---|---|---|
| `CLIPPINGS_ARENA_CHANNEL_ID` | Yes | The Are.na channel slug to display |
| `CLIPPINGS_ARENA_API_KEY` | Yes | Your Are.na API key (required for private channels) |
| `CLIPPINGS_SITE_URL` | No | Defaults to `https://clippings.myles.garden` |

You can get an Are.na API key from your [Are.na account settings](https://dev.are.na/).

## Development

Start the local dev server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321` with hot reload enabled.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the site for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run Astro type checking |
| `npm run prettier` | Check code formatting |
| `npm run prettier:write` | Auto-fix formatting issues |

## Code Quality

This project uses [Prettier](https://prettier.io/) for formatting. Before submitting a pull request, make sure your changes pass both checks:

```bash
npm run prettier
npm run check
```

These are the same checks run in CI.

## Deployment

The site is deployed to [Vercel](https://vercel.com/) automatically on pushes to `main`. A nightly rebuild also runs at 07:00 UTC to pick up any new Are.na content.
