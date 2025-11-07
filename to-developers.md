# 至开发者

写了几个 demo，你可以参考

全文搜索 `SUGGESTION` 就能搜出来

## 简单的使用说明

- `packages` 里的 mono 包里 api 是 tRPC 的，不想用可以不用，删掉也行（删掉就把 server 项目 里引用的 api 也删掉）
- `packages` 里的 mono 包里 db 是 drizzle orm 的，你不太可能用不上
- `packages` 里的 mono 包里 auth 是 better-auth 的，你不太可能用不上
- `apps` 里的 server 是 hono 的，你不太可能用不上
- `apps` 里的 web 是 nextjs 的，不想用可以不用，删掉也行

## 关于数据库

用 docker 起的
