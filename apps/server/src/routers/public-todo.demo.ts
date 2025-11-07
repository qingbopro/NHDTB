import { db } from "@NHDTB/db";
import { todo } from "@NHDTB/db/schema/todo";
import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { Hono } from "hono";

const app = new Hono();

// SUGGESTION: 这是一个通过createInsertSchema创建一个插入数据的zod Schema的demo
const insertTodoSchema = createInsertSchema(todo);

// SUGGESTION: 这是一个通过zValidator验证json body的demo
app.post(
  "/add",
  zValidator(
    "json",
    insertTodoSchema.pick({
      text: true,
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    await db.insert(todo).values({
      text: data.text,
    });
    return c.json({ message: "Todo added successfully" });
  },
);

export default app;
