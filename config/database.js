const mongoose = require('mongoose');

const connectDatabase = () => {
    const db = process.env.DB_LOCAL_URI;
    mongoose.connect(db, {
        useNewUrlParser: true,
    }).then(con => {
        console.log(`Database connected successfully with host: ${con.connection.host}`);
    });
}

module.exports = connectDatabase;
