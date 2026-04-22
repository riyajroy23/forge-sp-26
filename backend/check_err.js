import { config } from 'dotenv';
config();
import { supabase } from './lib/supabaseClient.ts';

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
