import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    const { data, error } = await supabase.from('User').select('*').limit(1);
    if (error) {
        console.error("Error querying User:", error);
    } else {
        console.log("Current schema columns for User table according to Supabase:");
        if (data && data.length > 0) {
            console.log(Object.keys(data[0]));
        } else {
            console.log("No data returned, cannot view columns. Doing a dummy insert to see error...");
            const dummyUser = { email: "fake@email.com", first_name: "A", last_name: "B", password: "123" };
            const { error: insertErr } = await supabase.from('User').insert([dummyUser]);
            console.log("Insert error:", insertErr ? insertErr.message : "Success");
        }
    }
}

test();
