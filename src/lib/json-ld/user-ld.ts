import type { Organization, Person } from "schema-dts";
import type { User } from "../schemas";
import urls from "../urls";

const GROUP_USER_TYPE = "Group";

/**
 * Are.na accounts are either individuals or groups, which map onto the
 * schema.org Person and Organization types respectively.
 */
export const formatUserToJsonLd = (user: User): Person | Organization => {
  const url = urls.external.user(user.slug);

  const sharedFields = {
    "@id": url,
    url,
    name: user.name,
    image: user.avatar ?? undefined,
  };

  if (user.type === GROUP_USER_TYPE) {
    return { ...sharedFields, "@type": "Organization" };
  }

  return { ...sharedFields, "@type": "Person" };
};
