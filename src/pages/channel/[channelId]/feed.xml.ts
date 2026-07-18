import config from "@/config";
import { sortBlocksByCreatedAt } from "@/lib/content";
import { formatBlockToFeedXMLItem, formatChannelToFeedXML } from "@/lib/feed";
import type { Block, Channel } from "@/lib/schemas";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import type { LiveCollectionError } from "astro/content/runtime";
import { getLiveCollection, getLiveEntry } from "astro:content";

type APIParams = { channelId: string };
type APIProps = {
  channel: Channel;
  blocks: Block[];
  channelError: Error | LiveCollectionError;
  blocksError: Error | LiveCollectionError;
};

export async function GET(
  context: APIContext<APIProps, APIParams>,
): Promise<Response> {
  const { site } = context;
  if (!site) return new Response("Site not found", { status: 404 });

  const { channel, blocks, channelError, blocksError } = context.props;
  if (!channel) throw channelError;
  if (!blocks) throw blocksError;

  return rss({
    ...(await formatChannelToFeedXML(channel, context)),
    items: await Promise.all(
      blocks
        .slice(0, config.PAGE_SIZE)
        .sort(sortBlocksByCreatedAt)
        .map(async (block) => formatBlockToFeedXMLItem(block, context)),
    ),
  });
}

export async function getStaticPaths() {
  const paths = await Promise.all(
    config.ARENA_OTHER_CHANNEL_IDS.map(async (channelId) => {
      const { entry: channel, error: channelError } = await getLiveEntry(
        "channels",
        channelId,
      );
      const { entries: blocks, error: blocksError } = await getLiveCollection(
        "blocks",
        { channelId: channelId },
      );

      return {
        params: { channelId },
        props: {
          channel,
          blocks,
          channelError,
          blocksError,
        },
      };
    }),
  );
  return paths.flat();
}
