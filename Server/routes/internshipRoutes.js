const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Endpoint: GET /api/internships
// This endpoint gets all internships with student and company names
router.get('/', async (req, res, next) => {
    try {
        const db = getDB();
        // JOIN to get names instead of just IDs
        const sql = `
            SELECT i.*, s.firstname, s.lastname, c.company_name 
            FROM internships i
            JOIN students s ON i.student_id = s.student_id
            JOIN companies c ON i.company_id = c.company_id
        `;
        const [rows] = await db.execute(sql);
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        next(err);
    }
});

// Endpoint: POST /api/internships
// This endpoint creates a new internship assignment
router.post('/', async (req, res, next) => {
    try {
        const { student_id, company_id, start_date, end_date, status } = req.body;
        const db = getDB();

        const [result] = await db.execute(
            'INSERT INTO internships (student_id, company_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [student_id, company_id, start_date, end_date, status || 'Not Started']
        );

        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Endpoint: PUT /api/internships/:id
// This endpoint updates an internship
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { student_id, company_id, start_date, end_date, status } = req.body;
        const db = getDB();

        await db.execute(
            'UPDATE internships SET student_id = ?, company_id = ?, start_date = ?, end_date = ?, status = ? WHERE internship_id = ?',
            [student_id, company_id, start_date, end_date, status, id]
        );

        res.status(200).json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        next(err);
    }
});

// Endpoint: DELETE /api/internships/:id
// This endpoint deletes an internship entry
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDB();
        await db.execute('DELETE FROM internships WHERE internship_id = ?', [id]);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
