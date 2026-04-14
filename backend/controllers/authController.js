const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donor = require('../models/Donor');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  res.status(statusCode).json({ success: true, token, user: userObj });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const user = await User.create({ name, email, password, role, phone });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account is deactivated' });

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  let donorProfile = null;
  if (user.role === 'donor') {
    donorProfile = await Donor.findOne({ userId: user._id });
  }
  res.json({ success: true, user, donorProfile });
};
