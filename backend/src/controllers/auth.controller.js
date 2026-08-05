const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const logger = require('../config/logger');
const { sendResetCodeEmail } = require('../helpers/mail');
const { signToken } = require('../helpers/token');

const RESET_CODE_EXPIRY_MINUTES = 10;

const generateResetCode = () => crypto.randomInt(100000, 999999).toString();

const isResetCodeValid = async (user, code) => {
  if (!user || !user.reset_code_hash || !user.reset_code_expires_at) {
    return false;
  }

  if (user.reset_code_expires_at < new Date()) {
    return false;
  }

  return bcrypt.compare(code, user.reset_code_hash);
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing_user = await User.findOne({ email });

    if (existing_user) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile_photo: user.profile_photo,
        },
      },
    });
  } catch (error) {
    logger.error(`Register Error: ${error.message}`);
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const is_password_valid = await user.comparePassword(password);

    if (!is_password_valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken({ id: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    return next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: '',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Get Profile Error: ${error.message}`);
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    const user = await User.findById(req.decoded.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const is_current_password_valid = await user.comparePassword(current_password);

    if (!is_current_password_valid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = new_password;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    logger.error(`Change Password Error: ${error.message}`);
    return next(error);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found for this email.' });
    }

    const code = generateResetCode();
    const salt = await bcrypt.genSalt(10);

    user.reset_code_hash = await bcrypt.hash(code, salt);
    user.reset_code_expires_at = new Date(Date.now() + RESET_CODE_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    await sendResetCodeEmail(user.email, code);

    return res.status(200).json({
      success: true,
      message: 'A reset code has been sent to your email.',
    });
  } catch (error) {
    logger.error(`Request Password Reset Error: ${error.message}`);
    return next(error);
  }
};

const verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email }).select('+reset_code_hash +reset_code_expires_at');

    const is_valid = await isResetCodeValid(user, code);

    if (!is_valid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code.' });
    }

    return res.status(200).json({ success: true, message: 'Code verified.' });
  } catch (error) {
    logger.error(`Verify Reset Code Error: ${error.message}`);
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({ email }).select('+reset_code_hash +reset_code_expires_at');

    const is_valid = await isResetCodeValid(user, code);

    if (!is_valid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code.' });
    }

    user.password = password;
    user.reset_code_hash = undefined;
    user.reset_code_expires_at = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    logger.error(`Reset Password Error: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
};
