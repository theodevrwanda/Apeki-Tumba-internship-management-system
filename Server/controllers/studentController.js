const { getDB } = require('../config/db');

/**
 * Controller for handling Student-related operations
 */
const StudentController = {
    /**
     * Get all students from the database
     */
    getAllStudents: async (req, res, next) => {
        try {
            const db = getDB();
            const [rows] = await db.execute('SELECT * FROM students ORDER BY student_id DESC');
            res.status(200).json({ success: true, data: rows });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Get a single student by their ID
     */
    getStudentById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const db = getDB();
            const [rows] = await db.execute('SELECT * FROM students WHERE student_id = ?', [id]);

            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }
            res.status(200).json({ success: true, data: rows[0] });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Create a new student record
     */
    createStudent: async (req, res, next) => {
        try {
            const { firstname, lastname, email, phone, level } = req.body;
            const db = getDB();

            const [result] = await db.execute(
                'INSERT INTO students (firstname, lastname, email, phone, level) VALUES (?, ?, ?, ?, ?)',
                [firstname, lastname, email, phone || null, level || null]
            );

            res.status(201).json({ success: true, id: result.insertId, message: 'Student created successfully' });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Update an existing student's information
     */
    updateStudent: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { firstname, lastname, email, phone, level } = req.body;
            const db = getDB();

            const [result] = await db.execute(
                'UPDATE students SET firstname = ?, lastname = ?, email = ?, phone = ?, level = ? WHERE student_id = ?',
                [firstname, lastname, email, phone, level, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }

            res.status(200).json({ success: true, message: 'Student updated successfully' });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Delete a student record
     */
    deleteStudent: async (req, res, next) => {
        try {
            const { id } = req.params;
            const db = getDB();

            const [result] = await db.execute('DELETE FROM students WHERE student_id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }

            res.status(200).json({ success: true, message: 'Student deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = StudentController;
