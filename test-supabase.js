require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'EXISTS' : 'MISSING');
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  // Test connection
  supabase.from('tae_newsletter_signups').select('count').then(result => {
    console.log('Supabase connection test:', result.error ? 'FAILED' : 'SUCCESS');
    if (result.error) console.log('Error:', result.error);
  });
} else {
  console.log('Missing Supabase environment variables!');
}