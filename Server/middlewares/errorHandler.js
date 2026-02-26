const handleErrors = (err, req, res, next) => {
    console.error(err.stack); // Still log to server console for debugging

    const statusCode = err.status || 500;
    const message = err.message || 'An unexpected error occurred on the server.';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        error: message,
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack // Only show in development
    });
};

module.exports = handleErrors;
