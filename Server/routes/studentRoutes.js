const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Endpoint: GET /api/students
// This endpoint gets all students from the database
router.get('/', async (req, res, next) => {
    try {
        const db = getDB();
        // We use direct SQL to fetch data - no models used here
        const [rows] = await db.execute('SELECT * FROM students');
        // Send the data back to the client
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        // Send error to the handler
        next(err);
    }
});

// Endpoint: GET /api/students/:id
// This endpoint gets one student using their ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const [rows] = await db.execute('SELECT * FROM students WHERE student_id = ?', [id]);

        // Check if student exists
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        // Send the student data
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        next(err);
    }
});

// Endpoint: POST /api/students
// This endpoint adds a new student to the database
router.post('/', async (req, res, next) => {
    try {
        const { firstname, lastname, email, phone, level } = req.body;
        const db = getDB();

        // Direct SQL Insert
        const [result] = await db.execute(
            'INSERT INTO students (firstname, lastname, email, phone, level) VALUES (?, ?, ?, ?, ?)',
            [firstname, lastname, email, phone || null, level || null]
        );

        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Endpoint: PUT /api/students/:id
// This endpoint updates a student's information
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, phone, level } = req.body;
        const db = getDB();

        // Update query using direct SQL
        await db.execute(
            'UPDATE students SET firstname = ?, lastname = ?, email = ?, phone = ?, level = ? WHERE student_id = ?',
            [firstname, lastname, email, phone, level, id]
        );

        res.status(200).json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        next(err);
    }
});

// Endpoint: DELETE /api/students/:id
// This endpoint deletes a student from the database
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDB();

        // Direct SQL Delete
        await db.execute('DELETE FROM students WHERE student_id = ?', [id]);

        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
