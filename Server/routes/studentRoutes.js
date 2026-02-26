const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

/**
 * Route: GET /api/students
 * Description: Retrieves all students
 */
router.get('/', StudentController.getAllStudents);

/**
 * Route: GET /api/students/:id
 * Description: Retrieves a specific student by ID
 */
router.get('/:id', StudentController.getStudentById);

/**
 * Route: POST /api/students
 * Description: Creates a new student record
 */
router.post('/', StudentController.createStudent);

/**
 * Route: PUT /api/students/:id
 * Description: Updates an existing student record
 */
router.put('/:id', StudentController.updateStudent);

/**
 * Route: DELETE /api/students/:id
 * Description: Deletes a student record
 */
router.delete('/:id', StudentController.deleteStudent);

module.exports = router;
