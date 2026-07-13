// The database layer is dormant until Sites or Cloudflare supplies a D1 binding.
// Keep it optional so the runtime guard in db/index.ts remains the source of truth.
interface __BaseEnv_Env {
  DB?: D1Database;
}
