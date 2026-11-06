import type { APIContext } from "astro";

import rss from "@astrojs/rss";
import { getLiveCollection, getLiveEntry } from "astro:content";

import config from "@/config";
import { sortBlocksByCreatedAt } from "@/lib/content";
import { formatBlockToFeedXMLItem, formatChannelToFeedXML } from "@/lib/feed";

export async function GET(context: APIContext) {
  const { site } = context;
  if (!site) return new Response("Site not found", { status: 404 });

  const { entry: channel, error: channelError } = await getLiveEntry(
    "channels",
    config.ARENA_MAIN_CHANNEL_ID,
  );
  if (!channel) throw channelError;

  const { entries: blocks, error: blocksError } = await getLiveCollection(
    "blocks",
    {
      channelId: config.ARENA_MAIN_CHANNEL_ID,
    },
  );
  if (!blocks) throw blocksError;

  return rss({
    ...(await formatChannelToFeedXML(channel, context)),
    items: await Promise.all(
      blocks
        .toSorted(sortBlocksByCreatedAt)
        .slice(0, config.PAGE_SIZE)
        .map(async (block) => formatBlockToFeedXMLItem(block, context)),
    ),
  });
}
