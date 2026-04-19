import express from 'express';
const router = express.Router();
import { supabase } from '../lib/supabaseClient.js';

// Mock data -- using hard-coded values, waiting for database connection
// const companies = [
//     {
//         company_id: 1,
//         name: 'Microsoft',
//         industry: 'Technology',
//         description: 'Developing and supporting software, services, devices, and solutions',
//         careers_page_url: 'https://careers.microsoft.com/v2/global/en/home.html',
//         logo_url: null,
//         headquarters_location: 'Redmond, WA',
//         roles: [
//             { role_id: 1, title: 'Software Engineer Co-op', area: 'Engineering', relevant_majors: ['Computer Science'] },
//             { role_id: 2, title: 'UI/UX Design Co-op', area: 'Design', relevant_majors: ['Design', 'Psychology', 'Computer Science'] },
//             { role_id: 3, title: 'Product Management Co-op', area: 'Business', relevant_majors: ['Business', 'Computer Science']}
//           ],
//         created_at: new Date('2025-03-15'),
//         updated_at: new Date('2025-03-21')
//     },
//     {
//         company_id: 2,
//         name: 'Boston Consulting Group',
//         industry: 'Consulting',
//         description: 'Global management consulting firm',
//         careers_page_url: 'https://careers.bcg.com/global/en/',
//         logo_url: null,
//         headquarters_location: 'Boston, Massachusetts',
//         roles: [
//             { role_id: 1, title: 'Accounting Co-op', area: 'Business', relevant_majors: ['Accounting', 'Finance'] },
//             { role_id: 2, title: 'Management Consultant Co-op', area: 'Business', relevant_majors: ['Economics', 'Accounting', 'Finance'] }
//           ],
//         created_at: new Date('2025-01-10'),
//         updated_at: new Date('2025-01-27')
//     },
//     {
//         company_id: 3,
//         name: 'Insulet Corporation',
//         industry: 'Healthcare',
//         description: 'Medical device company that develops, manufactures, and sells the Omnipod Insulin Management System',
//         careers_page_url: 'https://insulet.wd5.myworkdayjobs.com/insuletcareers',
//         logo_url: null,
//         headquarters_location: 'Acton, Massachusetts',
//         roles: [
//             { role_id: 1, title: 'Electrical Engineering Co-op', area: 'Engineering', relevant_majors: ['Electrical Engineering'] },
//             { role_id: 2, title: 'Marketing Co-op', area: 'Marketing', relevant_majors: ['Marketing', 'Communications'] }
//           ],
//         created_at: new Date('2025-09-13'),
//         updated_at: new Date('2025-09-25')
//     }
// ]


// company endpoints

// Return all companies on the platform
// GET /companies - return all companies
router.get('/companies', (req, res) => {
    return res.status(200).json(companies);
})

// Return the company with the specified name.
// GET /companies/name/:companyName - return the company with the name. 
router.get('/companies/name/:companyName', async (req, res) => {

    const { data, error } = await supabase
        .from('Company')
        .select('*');

    if (error || !data?.length) {
        return res.status(404).json("No companies found.");
    }

    // return company (if found)
    return res.status(200).json(data);
})


// Return the companies that match the given industry. 
// GET /companies/search/industry/:industry - return companies within the specified industry
router.get('/companies/search/industry/:industry', async (req, res) => {

    const { industry } = req.params;

    const { data, error } = await supabase
        .from('Company')
        .select('*')
        .ilike('industry', industry);

    if (error || !data?.length) {
        return res.status(404).json("No companies found in this industry.");
    }
    // return list of companies in the particular industry
    return res.status(200).json(data);
})


// Return the companies with headquarters in the specified location.
// GET /companies/search/location/:headquarters_location - return companies headquartered in the specific location
router.get('/companies/search/location/:headquarters_location', async (req, res) => {

    const { headquarters_location } = req.params;

    const { data, error } = await supabase
        .from('Company')
        .select('*')
        .ilike('headquarters_location', headquarters_location);

    if (error || !data?.length) {
        return res.status(404).json("No companies headquartered in this location.");
    }

    // return list of companies with headquartered in that location
    return res.status(200).json(data);
})


// Return the companies with roles relevant to the specified major. 
// GET /companies/search/major/:major - return companies with roles relevant to this major
router.get('/companies/search/major/:major', (req, res) => {

    const { major } = req.params;

    const { data, error } = await supabase
        .from('Company')
        .select('*, roles(*)')
        .contains('roles.relevant_majors', [major]);

    if (error || !data?.length) {
        return res.status(404).json("No companies have roles relevant to this major.");
    }

    // return list of companies with relevant roles
    return res.status(200).json(data);
})

// Return the company with the specified companyId.
// GET /companies/:companyId - return the company that matches the companyId. 
router.get('/companies/:companyId', (req, res) => {

    const companyId = parseInt(req.params.companyId, 10);

    if (isNaN(companyId)) {
        return res.status(400).json("Invalid company ID.");
    }

    const { data, error } = await supabase
        .from('Company')
        .select('*')
        .eq('id', companyId)
        .single();

    if (error || !data) {
        return res.status(404).json("Company not found.");
    }

    // return company (if found)
    return res.status(200).json(data);
})
