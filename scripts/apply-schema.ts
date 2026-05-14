import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

const password = 'shahraan%26afraan%404955'
const connectionString = `postgresql://postgres:${password}@db.myuppzsgmlgzlvbfuzim.supabase.co:5432/postgres`

async function run() {
  console.log('Connecting to Supabase DB...')
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    console.log('Connected!')
    
    const sql = fs.readFileSync(path.join(process.cwd(), 'Supabase', '000006-fix-schema-for-app.sql'), 'utf-8')
    console.log('Running schema update...')
    
    await client.query(sql)
    console.log('Schema successfully updated!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

run()
