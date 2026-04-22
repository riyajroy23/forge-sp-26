import { config } from 'dotenv';
config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
    const { data: company } = await supabase
        .from('Company')
        .select('id, name')
        .limit(1)
        .single();
    
    if (company) {
        console.log('Testing company:', company.name);
        const { data: roles, error: rolesError } = await supabase
            .from('CompanyRole')
            .select('id, title, description, relevant_majors, start_date, end_date, salary')
            .eq('company_name', company.name);
            
        if (rolesError) {
            console.error('ERROR:', rolesError);
        } else {
            console.log('SUCCESS:', roles);
        }
    }
}
test();
