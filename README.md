# myles' chippings

A small site for collection things I find interesting around the web. It connects to an [Are.na](https://are.na) channel and turns the blocks I save there into a brosable archive. Are.na handles the saving; this just handles the showing.

## Setup

Clone the repo and install dependencies:

```bash
$ git clone https://github.com/myles/clippings-myles-garden.git
$ cd clippings-myles-garden
$ npm install
```

Run the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

## Configration

This site reads from an Are.na channel via the public Are.na API. Configure your channel by creating a `.env` file in the project root:

```env
CLIPPINGS_ARENA_CHANNEL_ID="clippings"
```

You can find your channel slug in the URL of your Are.na channel (e.g. `are.na/myles/clippings` → `clippings`).

The Are.na API is public and doesn't require authentication for reading from public channels. If your channel is private, you'll also need an access token:

```env
CLIPPINGS_ARENA_API_KEY="i-am-an-arena-api-key"
```

You can generate one at [dev.are.na](https://www.are.na/developers).

## Deployment

This site is set up to deploy to Vercel. Push to your repo and import the project at [vercel.com/new](https://vercel.com/new). Make sure to add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

Any push to `main` will trigger a new deployment.
