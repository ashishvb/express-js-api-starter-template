const express = require('express');
const logger = require('morgan');
const dotEnv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const connectDB = require('./src/db');
const routes = require('./src/routes');

//Server specific config
dotEnv.config();

// Creating an instance of express
const app = express();

// Defining the port to be used
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Logging the incoming requests
if(process.env.ENVIRONMENT === 'dev'){
    app.use(logger('tiny'));
}

// Setting up cors 
app.use(cors());

// Parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parisng the cookies
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
if(process.env.ENVIRONMENT === 'prod'){
    const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
    });
    app.use(limiter);
}

// Prevent http param pollution
app.use(hpp());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Configuring the routes
app.use('/api/v1', routes);

// Starting the server
app.listen(PORT, () => { console.log(`Server listening at ${process.env.HOST}:${PORT}`) });