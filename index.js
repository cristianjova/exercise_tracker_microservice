const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

// Init app
const app = express();

// Connect to database
connectDB();

// Acepting json data into our API
app.use(express.json({ extended: false }));

// To extract data to req.body
app.use(express.urlencoded({ extended: false }));

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', require('./routes/api/index.js'));
app.use('/api/exercise/', require('./routes/api/user'));
app.use('/api/exercise/', require('./routes/api/exercise'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servicio iniciado en puerto ${PORT}`));
