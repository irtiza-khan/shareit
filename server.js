const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
require('dotenv').config()
const connectDB = require('./config/db');
const fileRoutes = require('./routes/api')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash');
const cors = require('cors');



const PORT = process.env.PORT || 5000;


//Database connection function 
connectDB();
app.use(morgan('dev'));

const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
        //[http://localhost:3000,https://localhost:5050]
}


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(flash());
app.use(express.json());
app.use(cors(corsOptions)); //cors middelware
//Template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));


//Routes MiddleWare

app.use('/api/files', fileRoutes);
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => console.log(`Port Listining on http://localhost:${PORT}`));