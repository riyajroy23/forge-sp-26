import express from 'express';
import { supabase } from '../lib/supabaseClient.js';

const router = express.Router();

// company endpoints

// Return all companies on the platform
// GET /companies - return all companies
router.get('/companies', async (req, res) => {
    const { data, error } = await supabase
        .from('Company')
        .select('*');

    if (error || !data?.length) {
        return res.status(404).json("No companies found.");
    }

    return res.status(200).json(data);
})

// Return the company with the specified name.
// GET /companies/name/:companyName - return the company with the name. 
router.get('/companies/name/:companyName', async (req, res) => {

    const { companyName } = req.params;

    const { data, error } = await supabase
        .from('Company')
        .select('*')
        .ilike('name', companyName)
        .single();

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
router.get('/companies/search/major/:major', async (req, res) => {

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
router.get('/companies/:companyId', async (req, res) => {

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

export default router;
