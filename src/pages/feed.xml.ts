import config from "@/config";
import { sortBlocksByCreatedAt } from "@/lib/content";
import { formatBlockToFeedXMLItem, formatChannelToFeedXML } from "@/lib/feed";
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
    ...(await formatChannelToFeedXML(channel, context)),
    items: await Promise.all(
      blocks
        .sort(sortBlocksByCreatedAt)
        .map(async (block) => formatBlockToFeedXMLItem(block, context)),
    ),
  });
}
