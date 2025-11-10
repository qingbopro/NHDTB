"use client";
import { useQuery } from "@tanstack/react-query";
import type { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function Dashboard({
  session,
}: {
  session?: typeof authClient.$Infer.Session | null;
}) {
  const { data, error } = useQuery(trpc.privateData.queryOptions());
  console.log(
    "%c [ error ]-12",
    "font-size:13px; background:pink; color:#bf2c9f;",
    error?.shape,
    error?.data,
    error?.message,
  );

  // SUGGESTION: tRPC 错误处理的DEMO
  if (error) {
    return (
      <>
        <pre>error data: {JSON.stringify(error?.data, null, 2)}</pre>
        <p>error shape: {JSON.stringify(error?.shape, null, 2)}</p>
        <p>error message: {error?.message}</p>
      </>
    );
  }

  return (
    <>
      <p>API: {data?.message}</p>
    </>
  );
}
