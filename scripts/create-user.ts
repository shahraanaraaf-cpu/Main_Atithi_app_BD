import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase dashboard > Settings > API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'whosain@live.com',
    password: 'Masum@4955',
    email_confirm: true,
    user_metadata: {
      full_name: 'Masum'
    }
  })

  if (error) {
    console.error('Error creating user:', error)
    return
  }

  console.log('User created successfully!')
  console.log('User ID:', data.user.id)
  console.log('Email:', data.user.email)

  // Create profile with HOST role
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      full_name: 'Masum',
      role: 'HOST',
      is_verified: true
    })

  if (profileError) {
    console.error('Error creating profile:', profileError)
  } else {
    console.log('Profile created with HOST role!')
  }
}

createUser()
