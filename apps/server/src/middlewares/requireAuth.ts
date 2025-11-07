import { auth } from "@NHDTB/auth";
import type { MiddlewareHandler } from "hono";

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user) {
    return c.json({ error: "UNAUTHORIZED" }, 401);
  }

  await next();
};
