const handleErrors = (err, req, res, next) => {
    console.error(`[Error] ${err.name}: ${err.message}`);

    let statusCode = err.status || 500;
    let message = err.message || 'An unexpected error occurred on the server.';

    // Handle MySQL Duplicate Entry (ER_DUP_ENTRY)
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409; // Conflict
        const field = err.sqlMessage.split("key '")[1]?.split("'")[0] || 'field';
        message = `This ${field.includes('email') ? 'email' : field.includes('phone') ? 'phone number' : field} is already in use. Please use a different one.`;
    }

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        error: message,
    });
};

module.exports = handleErrors;
