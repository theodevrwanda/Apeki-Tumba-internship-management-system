const { getDB } = require('../config/db');

/**
 * Controller for handling Company-related operations
 */
const CompanyController = {
    /**
     * Get all companies
     */
    getAllCompanies: async (req, res, next) => {
        try {
            const db = getDB();
            const [rows] = await db.execute('SELECT * FROM companies ORDER BY company_id DESC');
            res.status(200).json({ success: true, data: rows });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Get a single company by ID
     */
    getCompanyById: async (req, res, next) => {
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
    },

    /**
     * Create a new company
     */
    createCompany: async (req, res, next) => {
        try {
            const { company_name, address, email, supervisor_name, supervisor_phone } = req.body;
            const db = getDB();

            const [result] = await db.execute(
                'INSERT INTO companies (company_name, address, email, supervisor_name, supervisor_phone) VALUES (?, ?, ?, ?, ?)',
                [company_name, address || null, email || null, supervisor_name || null, supervisor_phone || null]
            );

            res.status(201).json({ success: true, id: result.insertId, message: 'Company created successfully' });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Update an existing company
     */
    updateCompany: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { company_name, address, email, supervisor_name, supervisor_phone } = req.body;
            const db = getDB();

            const [result] = await db.execute(
                'UPDATE companies SET company_name = ?, address = ?, email = ?, supervisor_name = ?, supervisor_phone = ? WHERE company_id = ?',
                [company_name, address, email, supervisor_name, supervisor_phone, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }

            res.status(200).json({ success: true, message: 'Company updated successfully' });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Delete a company
     */
    deleteCompany: async (req, res, next) => {
        try {
            const { id } = req.params;
            const db = getDB();

            const [result] = await db.execute('DELETE FROM companies WHERE company_id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }

            res.status(200).json({ success: true, message: 'Company deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = CompanyController;
