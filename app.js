const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');
const auth = require('./middleware/auth')


mongoose.connect(config.database);
const db = mongoose.connection;

// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Check for  DB errors
db.on('error', (err)=>{
  console.log(err);
});

// Init App
const app = express();
// Init Port
const port = 3000;

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Home Route
app.get('/', (req, res) => {
  res.render('home');
});

// Route Files
let booking = require('./routes/booking');
let users = require('./routes/users');
let reservations = require('./routes/reservations');
app.use('/booking', booking);
app.use('/users', users);
app.use('/reservations', reservations);

// Start Server
app.listen(port, () => {
  console.log(`Astra hotel app listening at http://localhost:${port}`);
});