const { getDB } = require('../config/db');

/**
 * Controller for handling Internship-related operations
 */
const InternshipController = {
    /**
     * Get all internships with joined student and company details
     */
    getAllInternships: async (req, res, next) => {
        try {
            const db = getDB();
            const sql = `
                SELECT i.*, s.firstname, s.lastname, c.company_name 
                FROM internships i
                JOIN students s ON i.student_id = s.student_id
                JOIN companies c ON i.company_id = c.company_id
                ORDER BY i.internship_id DESC
            `;
            const [rows] = await db.execute(sql);
            res.status(200).json({ success: true, data: rows });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Assign a student to a company for an internship
     */
    assignInternship: async (req, res, next) => {
        try {
            const { student_id, company_id, start_date, end_date, status } = req.body;
            const db = getDB();

            // Check if student already has an internship assignment
            const [existing] = await db.execute('SELECT * FROM internships WHERE student_id = ?', [student_id]);
            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: 'Student is already assigned to an internship.' });
            }

            const [result] = await db.execute(
                'INSERT INTO internships (student_id, company_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
                [student_id, company_id, start_date, end_date, status || 'Not Started']
            );

            res.status(201).json({ success: true, id: result.insertId, message: 'Internship assigned successfully' });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Update an internship assignment
     */
    updateInternship: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { student_id, company_id, start_date, end_date, status } = req.body;
            const db = getDB();

            const [result] = await db.execute(
                'UPDATE internships SET student_id = ?, company_id = ?, start_date = ?, end_date = ?, status = ? WHERE internship_id = ?',
                [student_id, company_id, start_date, end_date, status, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Internship not found' });
            }

            res.status(200).json({ success: true, message: 'Internship updated successfully' });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Delete an internship assignment
     */
    deleteInternship: async (req, res, next) => {
        try {
            const { id } = req.params;
            const db = getDB();

            const [result] = await db.execute('DELETE FROM internships WHERE internship_id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Internship not found' });
            }

            res.status(200).json({ success: true, message: 'Internship deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = InternshipController;
