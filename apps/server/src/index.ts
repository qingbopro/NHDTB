import "dotenv/config";
import { createContext } from "@NHDTB/api/context";
import { appRouter } from "@NHDTB/api/routers/index";
import { auth } from "@NHDTB/auth";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import protectedApiDemo from "./routers/protectedApi.demo";
import publicTodoDemo from "./routers/public-todo.demo";

const app = new Hono().basePath("/api");

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

/**
 * SUGGESTION: 如果你要写一个monorepo的nextjs的全栈项目，建议直接用trpc 配合 trpcClient
 * 好处是tRPC的类型定义是自动生成的，你不需要在前端项目中重复定义
 * 你还可以直接搭配tanstack query使用，省的写options
 */
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

/**
 * SUGGESTION: 如果你要写纯node的后端，建议不要用trpc，直接用hono的路由
 * 当然用hono也能rpc[https://hono.dev/docs/guides/rpc] ，但是体验不咋地，配合tanstack query也不咋地，不推荐
 * 用hono你还要自己在自己的前端项目实现自己的类型定义，当然你也可以用hono的infer[https://hono.dev/docs/guides/rpc#infer]取类型，但是你的前端项目是独立的你要怎么引入AppType呢？麻烦的很还是算了
 */
// SUGGESTION: app.route是拆分路由的一种写法，适合大型项目，把不同的功能模块拆分成不同的路由文件[https://hono.dev/docs/guides/best-practices#building-a-larger-application]
// 这是一个公开的API，不需要登录即可访问
app.route("/todo", publicTodoDemo);
// 这是一个受保护的API，需要登录才能访问
app.route("/protected", protectedApiDemo);

import { serve } from "@hono/node-server";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
