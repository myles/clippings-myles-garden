import config from "@/config";
import { sortBlocksByCreatedAt } from "@/lib/content";
import { formatBlockToFeedJsonItem, formatChannelToFeedJson } from "@/lib/feed";
import type { APIContext } from "astro";
import jsonFeed from "astro-jsonfeed";
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

  return jsonFeed(
    {
      ...(await formatChannelToFeedJson(channel, context)),
      items: await Promise.all(
        blocks
          .sort(sortBlocksByCreatedAt)
          .map((block) => formatBlockToFeedJsonItem(block, context)),
      ),
    },
    { space: 2 },
  );
}
