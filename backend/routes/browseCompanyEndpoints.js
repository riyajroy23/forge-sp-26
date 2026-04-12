import express from 'express';
const router = express.Router();

// Mock data -- using hard-coded values, waiting for database connection
const companies = [
    {
        company_id: 1,
        name: 'Microsoft',
        industry: 'Technology',
        description: 'Developing and supporting software, services, devices, and solutions',
        careers_page_url: 'https://careers.microsoft.com/v2/global/en/home.html',
        logo_url: null,
        headquarters_location: 'Redmond, WA',
        roles: [
            { role_id: 1, title: 'Software Engineer Co-op', area: 'Engineering', relevant_majors: ['Computer Science'] },
            { role_id: 2, title: 'UI/UX Design Co-op', area: 'Design', relevant_majors: ['Design', 'Psychology', 'Computer Science'] },
            { role_id: 3, title: 'Product Management Co-op', area: 'Business', relevant_majors: ['Business', 'Computer Science']}
          ],
        created_at: new Date('2025-03-15'),
        updated_at: new Date('2025-03-21')
    },
    {
        company_id: 2,
        name: 'Boston Consulting Group',
        industry: 'Consulting',
        description: 'Global management consulting firm',
        careers_page_url: 'https://careers.bcg.com/global/en/',
        logo_url: null,
        headquarters_location: 'Boston, Massachusetts',
        roles: [
            { role_id: 1, title: 'Accounting Co-op', area: 'Business', relevant_majors: ['Accounting', 'Finance'] },
            { role_id: 2, title: 'Management Consultant Co-op', area: 'Business', relevant_majors: ['Economics', 'Accounting', 'Finance'] }
          ],
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-27')
    },
    {
        company_id: 3,
        name: 'Insulet Corporation',
        industry: 'Healthcare',
        description: 'Medical device company that develops, manufactures, and sells the Omnipod Insulin Management System',
        careers_page_url: 'https://insulet.wd5.myworkdayjobs.com/insuletcareers',
        logo_url: null,
        headquarters_location: 'Acton, Massachusetts',
        roles: [
            { role_id: 1, title: 'Electrical Engineering Co-op', area: 'Engineering', relevant_majors: ['Electrical Engineering'] },
            { role_id: 2, title: 'Marketing Co-op', area: 'Marketing', relevant_majors: ['Marketing', 'Communications'] }
          ],
        created_at: new Date('2025-09-13'),
        updated_at: new Date('2025-09-25')
    }
]


// company endpoints

// Return all companies on the platform
// GET /companies - return all companies
router.get('/companies', (req, res) => {
    return res.status(200).json(companies);
})

// Return the company with the specified name.
// GET /companies/name/:companyName - return the company with the name. 
router.get('/companies/name/:companyName', (req, res) => {

    // extract field
    const companyName = req.params.companyName;

    const company = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());

    // handles case for where company does not exist on the platform
    if (!company) {
        return res.status(404).json("Company not found.");
    }

    // return company (if found)
    return res.status(200).json(company);
})


// Return the companies that match the given industry. 
// GET /companies/search/industry/:industry - return companies within the specified industry
router.get('/companies/search/industry/:industry', (req, res) => {

    // extract field
    const industry = req.params.industry;

    const matchedCompanies = companies.filter(c => c.industry.toLowerCase() === industry.toLowerCase());

    // handles case for where there aren't any companies in the industry
    if (matchedCompanies.length === 0) {
        return res.status(404).json("No companies found in this industry.");
    }

    // return list of companies in the particular industry
    return res.status(200).json(matchedCompanies);
})


// Return the companies with headquarters in the specified location.
// GET /companies/search/location/:headquarters_location - return companies headquartered in the specific location
router.get('/companies/search/location/:headquarters_location', (req, res) => {

    // extract field
    const hq = req.params.headquarters_location;

    const matchedCompanies = companies.filter(c => c.headquarters_location.toLowerCase() === hq.toLowerCase());

    // handles case for where there aren't any companies headquartered in the specific location
    if (matchedCompanies.length === 0) {
        return res.status(404).json("No companies headquartered in this location.");
    }

    // return list of companies with headquartered in that location
    return res.status(200).json(matchedCompanies);
})


// Return the companies with roles relevant to the specified major. 
// GET /companies/search/major/:major - return companies with roles relevant to this major
router.get('/companies/search/major/:major', (req, res) => {

    // extract field
    const major = req.params.major;

    const relevantCompanies = companies.filter(c => c.roles.some(r => r.relevant_majors.some(m => m.toLowerCase() === major.toLowerCase())));

    // handles case for where there aren't any companies with relevant roles
    if (relevantCompanies.length === 0) {
        return res.status(404).json("No companies have roles relevant to this major.");
    }

    // return list of companies with relevant roles
    return res.status(200).json(relevantCompanies);
})

// Return the company with the specified companyId.
// GET /companies/:companyId - return the company that matches the companyId.
router.get('/companies/:companyId', (req, res) => {

    // extract field
    const companyId = parseInt(req.params.companyId);

    const company = companies.find(c => c.company_id === companyId);

    // handles case for where company does not exist on the platform
    if (!company) {
        return res.status(404).json("Company not found.");
    }

    // return company (if found)
    return res.status(200).json(company);
})

export default router;
