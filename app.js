const express = require("express");
const dotenv = require("dotenv");

const app = express();

// setting up the config.env file
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});