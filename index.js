require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const express_rate_limit = require('express-rate-limit');       // For React pages
const { RateLimiterMemory } = require('rate-limiter-flexible');
const helmet = require('helmet');

//=========================
// Configuration
//=========================

//=========================
// Middlewares
//=========================
const frontRateLimiter = express_rate_limit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5
});
const staticRateLimiter = express_rate_limit({
    windowMs: 15 * 60 * 1000,   // 1 Minute
    max: 25
});

const webSocketLimiter = new RateLimiterMemory({
    points: 5,   // 5 accesses
    duration: 1, // per second
});

// HelmetJS for header security
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'", "'sha256-ZR7/1LOmceIOiUl3gnzAJJfZmCN+vHQ3KSjP3pqBR88='"]
        }
    }
}));

// Static files
app.use('/public', staticRateLimiter, express.static( path.join(__dirname, 'public')));
app.use('/static', staticRateLimiter, express.static( path.join(__dirname, 'react-frontend', 'build', 'static')));


//=========================
// Routes
//=========================
app.get('/*', frontRateLimiter, (req,res)=> {
    res.sendFile( path.join(__dirname, 'react-frontend', 'build', 'index.html'));
});


const httpServer = app.listen(process.env.PORT || 3000, ()=> {
    console.log("Web application started on port " + (process.env.PORT || 3000));
    console.log("Mode: " + process.env.NODE_ENV);
});


// WebSocket Logics.
require('./src/socketLogic.js')(httpServer, webSocketLimiter);