import type { APIContext } from "astro";
import jsonFeed from "astro-jsonfeed";
import { getLiveCollection, getLiveEntry } from "astro:content";
import config from "../config";
import { formatBlockToFeedContent } from "../lib/feed";
import urls from "../lib/urls";

export async function GET(context: APIContext) {
  const { site } = context;
  if (!site) return new Response("Site not found", { status: 404 });

  const { entry: channel, error: channelError } = await getLiveEntry(
    "channels",
    config.ARENA_CHANNEL_ID,
  );
  if (!channel) throw channelError;

  const { entries: blocks, error: blocksError } = await getLiveCollection(
    "blocks",
    { channelId: config.ARENA_CHANNEL_ID },
  );
  if (!blocks) throw blocksError;

  return jsonFeed(
    {
      title: channel.data.title,
      description: channel.data.description.plain,
      items: await Promise.all(
        blocks.map(async (block) => ({
          id: urls.block.detail(block.id),
          url: new URL(urls.block.detail(block.id), context.site).href,
          title: block.data.title ?? undefined,
          summary: block.data.description?.plain ?? undefined,
          content_html: await formatBlockToFeedContent(block, context),
        })),
      ),
    },
    { space: 2 },
  );
}
