const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');

/**
 * Route: GET /api/companies
 * Description: Retrieves all companies
 */
router.get('/', CompanyController.getAllCompanies);

/**
 * Route: GET /api/companies/:id
 * Description: Retrieves a specific company by ID
 */
router.get('/:id', CompanyController.getCompanyById);

/**
 * Route: POST /api/companies
 * Description: Adds a new company
 */
router.post('/', CompanyController.createCompany);

/**
 * Route: PUT /api/companies/:id
 * Description: Updates an existing company
 */
router.put('/:id', CompanyController.updateCompany);

/**
 * Route: DELETE /api/companies/:id
 * Description: Deletes a company record
 */
router.delete('/:id', CompanyController.deleteCompany);

module.exports = router;
