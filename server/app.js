require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const jwtDecode = require('jwt-decode');

connectDB();

const users = require('./routes/user');
const prescription = require('./routes/prescription');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', users);

const attachUser = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token){
    return res.status(401).json({message: 'Authentication Invalid'})
  }
  const decodedToken = jwtDecode(token.slice(7));

  if(!decodedToken){
    return res.status(401).json({message: 'There was a problem authorizing the user'})
  } else{
    req.user = decodedToken;
    next();
  }
}

app.use('/api', attachUser, prescription);

const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`server is running on port ${PORT}`));