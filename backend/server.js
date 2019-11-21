const express = require('express');
const connectDB = require('./config/db');
const auth = require("./middleware/auth");
const errorHandle = require("./middleware/errorHandle");
var path = require('path');

const app = express();

// Connect database
connectDB();

// Init Middleware (x)
app.use(express.json({extended: false}));

 
// Define routes
app.use('/api/settings', require('./routes/api/settings'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/azure', require('./routes/api/azure'));
app.use('/api/personGroups', require('./routes/api/personGroups'));
app.use('/api/images', require('./routes/api/images'));
app.use('/uploads', auth, express.static(path.join(__dirname, 'uploads')));
app.use(errorHandle);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

