import config from "@/config";
import { sortBlocksByCreatedAt } from "@/lib/content";
import { formatBlockToFeedContent } from "@/lib/feed";
import urls from "@/lib/urls";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getLiveCollection, getLiveEntry } from "astro:content";

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

  return rss({
    title: channel.data.title,
    description: channel.data.description ? channel.data.description.plain : "",
    site,
    items: await Promise.all(
      blocks.sort(sortBlocksByCreatedAt).map(async (block) => ({
        title: block.data.title ?? "",
        description: block.data.description?.plain ?? undefined,
        pubDate: block.data.created_at,
        link: new URL(urls.block.detail(block.id), site).href,
        content: await formatBlockToFeedContent(block, context),
      })),
    ),
  });
}
