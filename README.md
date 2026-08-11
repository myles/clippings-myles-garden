# myles' clippings

A small site for collecting things I find interesting around the web. It connects to an [Are.na](https://are.na) channel and turns the blocks I save there into a browsable archive. Are.na handles the saving; this just handles the showing.

It's an [Astro](https://astro.build) site. Blocks and channels are pulled from the Are.na API through Astro's live content collections and rendered into a static build, so the site reflects whatever was in the channel the last time it was built.

## Setup

You'll need Node 22.12 or newer.

Clone the repo and install dependencies:

```bash
$ git clone https://github.com/myles/clippings-myles-garden.git
$ cd clippings-myles-garden
$ npm install
```

Copy the sample environment file and fill it in (see [Configuration](#configuration)):

```bash
$ cp .env.sample .env
```

Run the development server:

```bash
$ npm run dev
```

The site will be available at `http://localhost:4321`.

### Scripts

| Script                   | What it does                                 |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Start the dev server                         |
| `npm run build`          | Build the site into `dist/`                  |
| `npm run preview`        | Preview the built site                       |
| `npm run check`          | Run `astro check` (types and template check) |
| `npm run prettier`       | Check formatting                             |
| `npm run prettier:write` | Fix formatting                               |

## Configuration

This site reads from an Are.na channel via the Are.na API. Configure it with a `.env` file in the project root:

```env
CLIPPINGS_ARENA_API_KEY="i-am-an-arena-api-key"
CLIPPINGS_ARENA_MAIN_CHANNEL_ID="clippings"
```

| Variable                            | Required | Default                          | What it's for                                                              |
| ----------------------------------- | -------- | -------------------------------- | -------------------------------------------------------------------------- |
| `CLIPPINGS_ARENA_API_KEY`           | yes      | —                                | Are.na personal access token, sent with every API request                  |
| `CLIPPINGS_ARENA_MAIN_CHANNEL_ID`   | yes      | —                                | The channel that becomes the front page                                    |
| `CLIPPINGS_ARENA_OTHER_CHANNEL_IDS` | no       | none                             | Comma-separated list of extra channels to publish at `/channel/<id>`       |
| `CLIPPINGS_SITE_URL`                | no       | `https://clippings.myles.garden` | Canonical site URL, used for feeds, the sitemap and metadata               |
| `CLIPPINGS_PAGE_SIZE`               | no       | `12`                             | Blocks per page, in both the listings and the feeds                        |
| `CLIPPINGS_SITE_TINYLYTICS_ID`      | no       | none                             | [Tinylytics](https://tinylytics.app) site ID; analytics are off without it |

Channel IDs are the slug in the URL of your Are.na channel (e.g. `are.na/myles/clippings` → `clippings`). You can generate an access token at <https://www.are.na/developers/personal-access-tokens>.

The build fails fast if `CLIPPINGS_ARENA_API_KEY` or `CLIPPINGS_ARENA_MAIN_CHANNEL_ID` are missing.

## What gets built

| Route                                                             | What's there                            |
| ----------------------------------------------------------------- | --------------------------------------- |
| `/`, `/2`, `/3`, …                                                | The main channel, paginated             |
| `/block/<blockId>`                                                | A single block                          |
| `/channel/<channelId>`                                            | One of the other channels, paginated    |
| `/feed.xml`, `/feed.json`                                         | RSS and JSON feeds for the main channel |
| `/channel/<channelId>/feed.xml`, `/channel/<channelId>/feed.json` | Per-channel feeds                       |
| `/sitemap-index.xml`                                              | Sitemap                                 |

All of the Are.na block types are handled: attachments, channels, embeds, images, links and text.

Are.na rate-limits fairly aggressively, so requests are cached for the length of a build and retried with backoff on a 429 or 5xx.

## Deployment

This site deploys to Vercel through the [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/) adapter. Push to your repo, import the project at [vercel.com/new](https://vercel.com/new), and add the environment variables under **Settings → Environment Variables**.

Any push to `main` triggers a new deployment.

Because the site is built statically, new blocks only show up on a rebuild. The `nightly-deploy` GitHub Action pings a Vercel deploy hook every night at 07:00 UTC to pick them up; it needs a `VERCEL_DEPLOY_HOOK` repository secret, and can also be run by hand from the Actions tab.

CI runs Prettier and `astro check` on every push and pull request against `main`.
