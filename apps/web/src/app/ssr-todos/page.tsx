import { appRouter } from "@NHDTB/api/routers";
import { auth } from "@NHDTB/auth";
import type { todo as todoTable } from "@NHDTB/db/schema/todo";
import type { InferSelectModel } from "drizzle-orm";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// SUGGESTION: 这是用 InferSelectModel 通过 db 获取 ts类型的 demo
type Todo = InferSelectModel<typeof todoTable>;

async function fetchTodos() {
  // SUGGESTION: 由于 SSR 页面不涉及用户交互，session 可以设为 null
  const caller = appRouter.createCaller({ session: null });
  const todos = await caller.todo.getAll();
  return todos;
}

async function fetchUserInfo() {
  const hdrs = await headers();
  const headerObj = Object.fromEntries(hdrs.entries()) as Record<
    string,
    string
  >;
  const session = await auth.api.getSession({ headers: headerObj });

  // SUGGESTION: 由于调用了 protectedProcedure，session 不能为空
  const caller = appRouter.createCaller({ session });
  const userInfo = await caller.privateData();
  return userInfo;
}

/**
 * SUGGESTION: 这是一个 SSR 页面，用 tRPC caller 的 demo
 */
export default async function TodosPage() {
  const todos = await fetchTodos();
  const userInfo = await fetchUserInfo();

  return (
    <div className="mx-auto w-full max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
          <pre>{JSON.stringify(userInfo.user, null, 2)}</pre>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <p className="py-4 text-center">No todos yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={
                        todo.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {todo.text}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
