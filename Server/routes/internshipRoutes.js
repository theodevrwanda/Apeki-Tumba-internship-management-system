const express = require('express');
const router = express.Router();
const InternshipController = require('../controllers/internshipController');

/**
 * Route: GET /api/internships
 * Description: Retrieves all internships with student and company names
 */
router.get('/', InternshipController.getAllInternships);

/**
 * Route: POST /api/internships
 * Description: Assigns a student to an internship
 */
router.post('/', InternshipController.assignInternship);

/**
 * Route: PUT /api/internships/:id
 * Description: Updates an internship assignment
 */
router.put('/:id', InternshipController.updateInternship);

/**
 * Route: DELETE /api/internships/:id
 * Description: Deletes an internship assignment
 */
router.delete('/:id', InternshipController.deleteInternship);

module.exports = router;
