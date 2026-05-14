import { Client } from 'pg'

const password = 'shahraan%26afraan%404955'
const connectionString = `postgresql://postgres:${password}@db.myuppzsgmlgzlvbfuzim.supabase.co:5432/postgres`
const DUMMY_UUID = '00000000-0000-0000-0000-000000000001'

async function run() {
  console.log('Connecting to Supabase DB to create dummy host...')
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    
    // Check if dummy user exists
    const res = await client.query(`SELECT id FROM auth.users WHERE id = $1`, [DUMMY_UUID])
    
    if (res.rowCount === 0) {
      console.log('Inserting dummy user into auth.users...')
      await client.query(`
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
        ) VALUES (
          '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', 'dummy@atithi.com', '', NOW(), NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dummy Host"}', NOW(), NOW(), '', '', '', ''
        )
      `, [DUMMY_UUID])
    }

    // Check if dummy profile exists
    const profileRes = await client.query(`SELECT id FROM public.profiles WHERE id = $1`, [DUMMY_UUID])
    if (profileRes.rowCount === 0) {
      console.log('Inserting dummy profile...')
      await client.query(`
        INSERT INTO public.profiles (id, full_name, role, is_verified)
        VALUES ($1, 'Atithi App BD Admin', 'HOST', true)
      `, [DUMMY_UUID])
    }
    
    console.log('Dummy host setup complete!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

run()
