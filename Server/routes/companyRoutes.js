const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// Endpoint: GET /api/companies
// This endpoint gets all companies from the database
router.get('/', async (req, res, next) => {
    try {
        const db = getDB();
        // SQL to fetch all companies
        const [rows] = await db.execute('SELECT * FROM companies');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        next(err);
    }
});

// Endpoint: GET /api/companies/:id
// This endpoint gets one company by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const [rows] = await db.execute('SELECT * FROM companies WHERE company_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        next(err);
    }
});

// Endpoint: POST /api/companies
// This endpoint adds a new company
router.post('/', async (req, res, next) => {
    try {
        const { company_name, address, email, supervisor_name, supervisor_phone } = req.body;
        const db = getDB();

        const [result] = await db.execute(
            'INSERT INTO companies (company_name, address, email, supervisor_name, supervisor_phone) VALUES (?, ?, ?, ?, ?)',
            [company_name, address || null, email || null, supervisor_name || null, supervisor_phone || null]
        );

        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Endpoint: PUT /api/companies/:id
// This endpoint updates company info
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company_name, address, email, supervisor_name, supervisor_phone } = req.body;
        const db = getDB();

        await db.execute(
            'UPDATE companies SET company_name = ?, address = ?, email = ?, supervisor_name = ?, supervisor_phone = ? WHERE company_id = ?',
            [company_name, address, email, supervisor_name, supervisor_phone, id]
        );

        res.status(200).json({ success: true, message: 'Updated successfully' });
    } catch (err) {
        next(err);
    }
});

// Endpoint: DELETE /api/companies/:id
// This endpoint deletes a company
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDB();
        await db.execute('DELETE FROM companies WHERE company_id = ?', [id]);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
