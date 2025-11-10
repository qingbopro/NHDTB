"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";

async function fetchProtected(): Promise<string> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/protected`,
    {
      credentials: "include",
    },
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  return typeof data === "string" ? data : JSON.stringify(data);
}

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const protectedCheck = useQuery({
    queryKey: ["protectedCheck"],
    queryFn: fetchProtected,
  });

  // SUGGESTION: 这是一个通过fetch调用hono路由的demo
  const createTodo = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/todo/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "New Todo",
      }),
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                healthCheck.data ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-muted-foreground text-sm">
              {healthCheck.isLoading
                ? "Checking..."
                : healthCheck.data
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </section>
        <section>
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            type="button"
            onClick={createTodo}
          >
            create
          </button>
        </section>
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Protected API Demo</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                protectedCheck.isSuccess ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            <span className="text-muted-foreground text-sm">
              {protectedCheck.isLoading
                ? "Loading..."
                : protectedCheck.isError
                  ? "Unauthorized or Error"
                  : "Authorized"}
            </span>
          </div>
          <pre className="mt-3 rounded bg-muted p-3 text-sm">
            {protectedCheck.isLoading
              ? ""
              : protectedCheck.isError
                ? String((protectedCheck.error as Error)?.message)
                : protectedCheck.data}
          </pre>
        </section>
      </div>
    </div>
  );
}
