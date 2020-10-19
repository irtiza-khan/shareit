const mongoose = require('mongoose');


async function connectDB() {
    //Database Connection
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useCreateIndex: true,
            useFindAndModify: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        if (conn) {
            console.log(`Mongo Db Connected To ${conn.connection.host}`);
        }

    } catch (err) {
        console.log(err);

    }
}


module.exports = connectDB;