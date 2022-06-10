const ErrorHandler = require("../utils/error_handler");

module.exports = (err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    if(process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack
        });
    }

    if(process.env.NODE_ENV === 'production') {
        let error = {...err};
        error.message = err.message;

        // Wrong Mongoose Object ID Error
        if(error.name === 'CastError') {
            const message = `Resource not found with id of ${error.path}`;
            error = new ErrorHandler(message, 404);
        }

        // Mongoose Validation Error
        if(error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message);
            error = new ErrorHandler(message, 400);
        }

        res.status(err.statusCode).json({
            success: false,
            message: err.message || 'Internal Server Error',
        });
    }

}