import { config } from 'dotenv';
config();
import { supabase } from './lib/supabaseClient.ts';

async function check() {
    const { data: companies } = await supabase.from('Company').select('id, name');
    console.log('Companies count:', companies?.length);
    
    // Find ack marine
    const ack = companies?.find(c => c.name.toLowerCase().includes('ack marine'));
    console.log('Ack Marine Company:', ack);

    if (ack) {
        const { data: roles } = await supabase.from('CompanyRole').select('*').ilike('company_name', '%ack marine%');
        console.log('Roles from CompanyRole table for ack marine:', roles?.length);
        console.log(roles);
    }
}
check();
