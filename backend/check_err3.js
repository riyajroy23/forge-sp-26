import { config } from 'dotenv';
config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
    const { data: roles, error: rolesError } = await supabase
        .from('CompanyRole')
        .select('*')
        .limit(1);
    
    if (rolesError) {
        console.error('ERROR:', rolesError);
    } else {
        console.log('KEYS:', Object.keys(roles[0]));
    }
}
test();
