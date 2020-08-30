const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRoute = require('./routes/post')

dotenv.config()
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log("Connected to db!")
);

const authRoute = require('./routes/auth');

// Middleware
app.use(express.json())

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log("Server is up and running!"));