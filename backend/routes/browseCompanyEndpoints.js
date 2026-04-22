const express = require('express');
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
];

// GET /companies
router.get('/companies', (req, res) => {
    return res.status(200).json(companies);
});

// GET /companies/name/:companyName
router.get('/companies/name/:companyName', (req, res) => {
    const companyName = req.params.companyName;
    const company = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
    if (!company) return res.status(404).json("Company not found.");
    return res.status(200).json(company);
});

// GET /companies/search/industry/:industry
router.get('/companies/search/industry/:industry', (req, res) => {
    const industry = req.params.industry;
    const matchedCompanies = companies.filter(c => c.industry.toLowerCase() === industry.toLowerCase());
    if (matchedCompanies.length === 0) return res.status(404).json("No companies found in this industry.");
    return res.status(200).json(matchedCompanies);
});

// GET /companies/search/location/:headquarters_location
router.get('/companies/search/location/:headquarters_location', (req, res) => {
    const hq = req.params.headquarters_location;
    const matchedCompanies = companies.filter(c => c.headquarters_location.toLowerCase() === hq.toLowerCase());
    if (matchedCompanies.length === 0) return res.status(404).json("No companies headquartered in this location.");
    return res.status(200).json(matchedCompanies);
});

// GET /companies/search/major/:major
router.get('/companies/search/major/:major', (req, res) => {
    const major = req.params.major;
    const relevantCompanies = companies.filter(c => c.roles.some(r => r.relevant_majors.some(m => m.toLowerCase() === major.toLowerCase())));
    if (relevantCompanies.length === 0) return res.status(404).json("No companies have roles relevant to this major.");
    return res.status(200).json(relevantCompanies);
});

// GET /companies/:companyId
router.get('/companies/:companyId', (req, res) => {
    const companyId = parseInt(req.params.companyId);
    const company = companies.find(c => c.company_id === companyId);
    if (!company) return res.status(404).json("Company not found.");
    return res.status(200).json(company);
});

module.exports = router;
