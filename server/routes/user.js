const express = require('express');
const router = express.Router();

const {authenticateUser, signup} = require('../controllers/userControllers');

router
  .route('/login')
  .post(authenticateUser)

router
  .route('/signup')
  .post(signup)
module.exports = router;