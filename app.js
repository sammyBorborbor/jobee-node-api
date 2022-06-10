const express = require("express");
const dotenv = require("dotenv");

const app = express();
const connectDatabase = require("./config/database");
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/error_handler");

// setting up the config.env file
dotenv.config({path: "./config/config.env"});

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION", err.name, err.message);
    process.exit(1);
});

// setting up the database
connectDatabase();

// setup body parser
app.use(express.json());
// setting up the middlewares
// const middleware = (req, res, next) => {
//     console.log("Hello from middleware");
//
//     // setting up user
//     // req.user = 'Samuel Owusu';
//     req.requestMethod = req.method;
//     next();
// }
// app.use(middleware);

const jobs = require("./routes/jobs");
app.use('/api/v1', jobs);

app.all("*", (req, _res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promised rejection`);
    // close server and exit process
    // process.exit(1);
    server.close(() => {
        process.exit(1);
    });
});
