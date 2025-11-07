import { Hono } from "hono";
import { requireAuth } from "@/middlewares/requireAuth";

const app = new Hono();

app.use("*", requireAuth);

app.get("/", (c) => c.json("protected list authors"));
app.post("/", (c) => c.json("protected create an author", 201));
app.get("/:id", (c) => c.json(`protected get ${c.req.param("id")}`));

export default app;
