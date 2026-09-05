import type { ImageObject, QuantitativeValue } from "schema-dts";
import type { ImageSchema } from "../schemas";

/** UN/CEFACT code for pixels, the unit Are.na reports dimensions in. */
const PIXEL_UNIT_CODE = "E37";

/**
 * schema.org measures media in `Distance` or `QuantitativeValue` rather
 * than bare numbers, so raw pixel counts have to be given a unit.
 */
export const formatPixelsToJsonLd = (
  value: number | null | undefined,
): QuantitativeValue | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  return {
    "@type": "QuantitativeValue",
    value,
    unitCode: PIXEL_UNIT_CODE,
  };
};

export const formatImageToJsonLd = (
  image: ImageSchema,
  id: string,
): ImageObject => ({
  "@id": id,
  "@type": "ImageObject",
  url: image.src,
  contentUrl: image.src,
  encodingFormat: image.content_type,
  name: image.filename,
  caption: image.alt_text ?? undefined,
  width: formatPixelsToJsonLd(image.width),
  height: formatPixelsToJsonLd(image.height),
});
