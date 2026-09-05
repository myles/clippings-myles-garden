import type { z } from "astro/zod";
import { userSchema } from "./base-schema";

export type User = z.infer<typeof userSchema>;
