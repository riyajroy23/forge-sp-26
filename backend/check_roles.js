import { config } from 'dotenv';
config();
import { supabase } from './lib/supabaseClient.ts';

async function test() {
  const { data, error } = await supabase.from('CompanyRole').select('*').limit(1);
  console.log('DATA:', JSON.stringify(data, null, 2));
  if (error) console.log('ERROR:', error);
}

test();
