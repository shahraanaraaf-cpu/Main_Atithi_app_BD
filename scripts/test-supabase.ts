import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl)
  const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true })
  
  if (error) {
    console.error('Error connecting to categories:', error)
  } else {
    console.log('Successfully connected to categories. Count:', data)
  }

  const { data: users, error: userError } = await supabase.from('users').select('count', { count: 'exact', head: true })
  if (userError) {
    console.error('Error connecting to users:', userError)
  } else {
    console.log('Successfully connected to users. Count:', users)
  }
}

testConnection()
