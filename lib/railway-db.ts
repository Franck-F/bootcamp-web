import { Pool } from "pg"

// Configuration pour Railway PostgreSQL
const pool = new Pool({
  connectionString: "postgresql://postgres:KiLIPLactECcLoszwlPMLzwHuKEMifoa@postgres.railway.internal:5432/railway",
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    client.release()
  }
}

export { pool }
