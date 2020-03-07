const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

// Init app
const app = express();

// Connect DB
connectDB();

// For fcc test
const cors = require('cors');
app.use(cors);

// Acepting JSON data into our API
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  return console.log(`Servicio iniciado en puerto ${PORT}`);
});
