const express = require('express');
const router = express.Router();

// Mock data for company people -- using hard-coded values, waiting for database connection
const company_people = [
    {
        person_id: 1,
        name: 'John Smith',
        company_id: 1,
        role: 'Software Engineer', 
        company_email: 'john.smith@google.com',
        linkedin_url: null,
        created_at: new Date('2025-03-15'),
        updated_at: new Date('2025-03-21')
    },
    {
        person_id: 2,
        name: 'Jane Williams',
        company_id: 2,
        role: 'Business Analyst', 
        company_email: 'jane.williams@goldmansachs.com',
        linkedin_url: null,
        created_at: new Date('2025-04-03'),
        updated_at: new Date('2025-04-05')
    }
]

// company people endpoints


// Return the person at the specified company with the specified personId. 
// GET /companies/:companyId/people/:personId - return the person at the company with that personId
router.get('/companies/:companyId/people/:personId', (req, res) => {

    // extract fields
    const companyId = parseInt(req.params.companyId);
    const personId = parseInt(req.params.personId);

    const person = company_people.find(c => c.company_id === companyId && c.person_id === personId);

    // handles case for where there is no person who matches personId and works at he company
    if (!person) {
        return res.status(404).json("Person not found.");
    }

    // return person (if found)
    return res.status(200).json(person);
})

// Return all people at a specific company, optionally filtered by their role.  
// GET /companies/:companyId/people?role=... - return all people at the company (filtered by role if provided)
router.get('/companies/:companyId/people', (req, res) => {

    // extract fields
    const companyId = parseInt(req.params.companyId);
    const role = req.query.role;

    // handles case when companyId is invalid (no company exists for that companyId)
    const company = companies.find(c => c.company_id === companyId);
    if (!company) {
        return res.status(404).json("Company not found.");
    }

    let people = company_people.filter(c => c.company_id === companyId);
    if (role) {
        people = people.filter(p => p.role.toLowerCase() === role.toLowerCase());
    }

    // handles case for where there is no person who has that role at the company
    if (people.length === 0) {
        return res.status(404).json("No people found for this company.");
    }

    // return people (if found)
    return res.status(200).json(people);
})


// Mock data for for company interview questions -- using hard-coded values, waiting for database connection
const company_interviewQuestions = [
    {
        question_id: 1,
        question: 'Write an algorithm for binary search.',
        type: 'technical',  
        company_id: 1,
        role: 'Software Engineer Co-op',
        created_at: new Date('2026-03-01')
    }, 
    {
        question_id: 2,
        question: 'Tell me about a time you dealt with a challenge.',
        type: 'behavioural',   
        company_id: 2,
        role: null, // null means applies to all roles
        created_at: new Date('2025-03-17')
    }
]


// company interview question endpoints

// Return all behavioural interview questions at the specific company.
// GET /companies/:companyId/questions/behavioural - return all behavioural interview questions at that company (regardless of role)
router.get('/companies/:companyId/questions/behavorial', (req, res) => {

    // extract field
    const companyId = parseInt(req.params.companyId);

    const company = companies.find(c => c.company_id === companyId);
    if (!company) {
        return res.status(404).json("Company not found.");
    }

    const behavioural_interview_questions = company_interviewQuestions.filter(c => c.company_id === companyId && c.type.toLowerCase() === 'behavioural');

    // handles case for where there are no behavorial interview questions for company
    if (behavioural_interview_questions.length === 0) {
        return res.status(404).json("No behavorial interview questions found for this company.");
    }

    // return interview questions for company (if found)
    return res.status(200).json(behavioural_interview_questions);
})

// Return all interview questions at the specific company.
// GET /companies/:companyId/questions?role=... - return all interview questions at that company (regardless of role), optionally filtered by role
router.get('/companies/:companyId/questions', (req, res) => {

    // extract fields
    const companyId = parseInt(req.params.companyId);
    const role = req.query.role;

    const company = companies.find(c => c.company_id === companyId);
    if (!company) {
        return res.status(404).json("Company not found.");
    }

    let interview_questions = company_interviewQuestions.filter(c => c.company_id === companyId);
    if (role) {
        interview_questions = interview_questions.filter(q => q.role === null || q.role.toLowerCase() === role.toLowerCase());
    }

    // handles case for where there are no interview questions for company
    if (interview_questions.length === 0) {
        return res.status(404).json("No interview questions found for this company.");
    }

    // return interview questions for company (if found)
    return res.status(200).json(interview_questions);
})
