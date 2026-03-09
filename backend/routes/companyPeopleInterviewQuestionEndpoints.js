const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

// Mock data for company people -- using hard-coded values, waiting for database connection
// const company_people = [
//     {
//         person_id: 1,
//         name: 'John Smith',
//         company_id: 1,
//         role: 'Software Engineer', 
//         company_email: 'john.smith@google.com',
//         linkedin_url: null,
//         created_at: new Date('2025-03-15'),
//         updated_at: new Date('2025-03-21')
//     },
//     {
//         person_id: 2,
//         name: 'Jane Williams',
//         company_id: 2,
//         role: 'Business Analyst', 
//         company_email: 'jane.williams@goldmansachs.com',
//         linkedin_url: null,
//         created_at: new Date('2025-04-03'),
//         updated_at: new Date('2025-04-05')
//     }
// ]

// company people endpoints


// Return the person at the specified company with the specified personId. 
// GET /companies/:companyId/people/:personId - return the person at the company with that personId
router.get('/companies/:companyId/people/:personId', async(req, res) => {

    // extract fields
    const companyId = parseInt(req.params.companyId);
    const personId = parseInt(req.params.personId);

    const { data, error } = await supabase
            .from('company_people')
                .select('*') 
                .eq('company_id', companyId)
                .eq('person_id', personId)
                .single();

            // cannot find person with specific id
            if (error || !data) {
                return res.status(404).json("Person not found.");
            }

            // otherwise, return person if successful
            return res.status(200).json(data);
});


// Return all people at a specific company, optionally filtered by their role.  
// GET /companies/:companyId/people?role=... - return all people at the company (filtered by role if provided)
router.get('/companies/:companyId/people', async(req, res) => {

    // extract fields
    const companyId = parseInt(req.params.companyId);
    const role = req.query.role;

    let query = supabase
            .from('company_people')
            .select('*')
            .eq('company_id', companyId)
        
    if (role) {
        query = query.ilike('role', role);
    }

    const { data, error } = await query;

    // cannot find people at company
    if (error || !data?.length) {
        return res.status(404).json("No people found for this company.");
    }

    // otherwise, return people if successful
    return res.status(200).json(data);
});


// Mock data for for company interview questions -- using hard-coded values, waiting for database connection
// const company_interview_questions = [
//     {
//         question_id: 1,
//         question: 'Write an algorithm for binary search.',
//         type: 'technical',  
//         company_id: 1,
//         role: 'Software Engineer Co-op',
//         created_at: new Date('2026-03-01')
//     }, 
//     {
//         question_id: 2,
//         question: 'Tell me about a time you dealt with a challenge.',
//         type: 'behavioural',   
//         company_id: 2,
//         role: null, // null means applies to all roles
//         created_at: new Date('2025-03-17')
//     }
// ]


// company interview question endpoints


// Return the interview question with the specified questionId. 
// GET /companies/:companyId/questions/:questionId - return the question with that questionId
router.get('/companies/:companyId/questions/:questionId', async(req, res) => {

    // extract fields    
    const companyId = parseInt(req.params.companyId);
    const questionId = parseInt(req.params.questionId);

    const { data, error } = await supabase
            .from('company_interview_questions')
                .select('*') 
                .eq('company_id', companyId)
                .eq('question_id', questionId)
                .single();

            // cannot find question with specific id
            if (error || !data) {
                return res.status(404).json("Question cannot be found.");
            }

            // otherwise, return question if successful
            return res.status(200).json(data);
});

// Return all behavioural interview questions at the specific company.
// GET /companies/:companyId/questions/behavioural - return all behavioural interview questions at that company (regardless of role)
router.get('/companies/:companyId/questions/behavorial', async(req, res) => {

    // extract field
    const companyId = parseInt(req.params.companyId);

    const { data, error } =  await supabase        
            .from('company_interview_questions')
                .select('*')
                .eq('company_id', companyId)
                .eq('type', 'behavioural')

    // handles case for where there are no behavorial interview questions for company
    if (error || !data?.length) {
        return res.status(404).json("No behavorial interview questions found for this company.");
    }

    // return all behavorial interview questions for company (if found)
    return res.status(200).json(data);
})


// Return all interview questions at the specific company, optionally filtered by role. 
// GET /companies/:companyId/questions?role=... - return all interview questions at that company (regardless of role), optionally filtered by role
router.get('/companies/:companyId/questions', async(req, res) => {

    // extract fields
    const companyId = parseInt(req.params.companyId);
    const role = req.query.role;

    let query = supabase 
            .from('company_interview_questions')
            .select('*')
            .eq('company_id', companyId)
    
    if (role) {
        query = query.ilike('role', role);
    }

    const { data, error } =  await query;

    // cannot find interview questions at company
    if (error || !data?.length) {
        return res.status(404).json("No interview questions found for this company.");
    }

    // otherwise, return interview questions if found
    return res.status(200).json(data);

})
