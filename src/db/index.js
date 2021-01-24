const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log('DATABASE CONNECTION SUCCESSFULL')

    } catch (error) {
        console.log('ERROR IN CONNECTING TO THE DATABASE');
        process.exit(1)
    }
}

module.exports = connectDB;