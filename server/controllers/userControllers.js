const User = require('../Models/User');
const jwtDecode = require('jwt-decode');
const sendMail = require('../sendEmail/sendgrid')

const {
  createToken,
  hashPassword,
  verifyPassword
} = require('../utils/utils');

//POST: /api/login
exports.authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email
    }).lean()
    if (!user) {
      return res.status(403).json({
        message: 'Wrong email'
      });
    }
    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const { password, bio, ...rest } = user;
      const userInfo = Object.assign({}, { ...rest });

      const token = createToken(userInfo);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong Email or password.'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Something went wrong' })
  }
}

//POST /api/register
exports.signup = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body;

    const hashedPassword = await hashPassword(req.body.password);
    const userData = {
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      role: 'user'
    };
    const existingEmail = await User.findOne({
      email: userData.email
    }).lean();

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      sendMail('gyfe@gyfe.com', savedUser.email, 'Welcome Email', `You are welcome here, ${savedUser.firstName}`)

      const { firstName, lastName, email, role } = savedUser;
      const userInfo = { firstName, lastName, email, role };

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account'
      });
    }

  } catch (err) {
    return res.status(400).json({
      message: 'There was an error while creating your account'
    });
  }
}