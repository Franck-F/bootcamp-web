export const railwayConfig = {
  host: "postgres.railway.internal",
  port: 5432,
  database: "railway",
  username: "postgres",
  password: "KiLIPLactECcLoszwlPMLzwHuKEMifoa",
  connectionString: "postgresql://postgres:KiLIPLactECcLoszwlPMLzwHuKEMifoa@postgres.railway.internal:5432/railway",
}

export const isDevelopment = process.env.NODE_ENV === "development"
export const isProduction = process.env.NODE_ENV === "production"

// Railway environment variables mapping
export const envVars = {
  DATABASE_URL: process.env.DATABASE_URL || railwayConfig.connectionString,
  PGHOST: process.env.PGHOST || railwayConfig.host,
  PGPORT: process.env.PGPORT || railwayConfig.port.toString(),
  PGDATABASE: process.env.PGDATABASE || railwayConfig.database,
  PGUSER: process.env.PGUSER || railwayConfig.username,
  PGPASSWORD: process.env.PGPASSWORD || railwayConfig.password,
}
