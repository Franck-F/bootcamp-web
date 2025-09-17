import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    let processedQuery = text
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        processedQuery = processedQuery.replace(
          `$${index + 1}`,
          typeof param === "string" ? `'${param}'` : String(param),
        )
      })
    }

    const res = await sql(processedQuery)
    const duration = Date.now() - start
    console.log("Executed query", { text: processedQuery, duration, rows: res.length })
    return { rows: res, rowCount: res.length }
  } catch (error) {
    const duration = Date.now() - start
    console.error("Query error", { text, duration, error })
    throw error
  }
}

export const sqlTemplate = (strings: TemplateStringsArray, ...values: any[]) => {
  let query = strings[0]
  const params: any[] = []

  for (let i = 0; i < values.length; i++) {
    query += `$${i + 1}${strings[i + 1]}`
    params.push(values[i])
  }

  return { query, params }
}

export async function sqlQuery(strings: TemplateStringsArray, ...values: any[]) {
  const { query: queryText, params } = sqlTemplate(strings, ...values)
  return await query(queryText, params)
}

export { sql }

export default sql
