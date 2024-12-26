const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
//const place = require('./models/place');
const HttpError = require('./models/http-error');
const path = require('path');
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

//Handling CORS Errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

// Routes for places and users
app.use('/api/places', placesRoutes); // Routes for /api/places
app.use('/api/users', usersRoutes);  // Routes for /api/users

// Middleware for handling unhandled routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

// Global error handling middleware
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

// Connect to MongoDB and start the server
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iyx2c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
        { useNewUrlParser: true, useUnifiedTopology: true } // Recommended options for Mongoose
    )
    .then(() => {
        console.log('Connected to MongoDB!');
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });
