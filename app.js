const express = require("express");
const dotenv = require("dotenv");

const app = express();
const connectDatabase = require("./config/database");

// setting up the config.env file
dotenv.config({path: "./config/config.env"});
// setting up the database
connectDatabase();

// setting up the middlewares
const middleware = (req, res, next) => {
    console.log("Hello from middleware");

    // setting up user
    // req.user = 'Samuel Owusu';
    req.requestMethod = req.method;
    next();
}
app.use(middleware);

const jobs = require("./routes/jobs");
app.use('/api/v1', jobs);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});