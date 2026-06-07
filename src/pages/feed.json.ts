import config from "@/config";
import { sortBlocksByCreatedAt } from "@/lib/content";
import { formatBlockToFeedContent } from "@/lib/feed";
import urls from "@/lib/urls";
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
      title: channel.data.title,
      description: channel.data.description
        ? channel.data.description.plain
        : undefined,
      items: await Promise.all(
        blocks.sort(sortBlocksByCreatedAt).map(async (block) => ({
          id: urls.block.detail(block.id),
          url: new URL(urls.block.detail(block.id), context.site).href,
          external_url: urls.external.block(block.id),
          title: block.data.title ?? undefined,
          summary: block.data.description?.plain ?? undefined,
          date_published: block.data.created_at,
          date_modified: block.data.updated_at,
          content_html: await formatBlockToFeedContent(block, context),
        })),
      ),
    },
    { space: 2 },
  );
}
