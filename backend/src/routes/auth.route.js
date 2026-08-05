const express = require('express');
const authController = require('../controllers/auth.controller');
const { AuthVerifier } = require('../middleware/auth.middleware');
const validator = require('../middleware/validator');
const {
  loginSchema,
  registerSchema,
  requestResetSchema,
  verifyCodeSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../helpers/validators');

const router = express.Router();

router.post('/register', validator(registerSchema), authController.register);
router.post('/login', validator(loginSchema), authController.login);
router.get('/me', AuthVerifier, authController.getProfile);
router.post(
  '/change-password',
  AuthVerifier,
  validator(changePasswordSchema),
  authController.changePassword,
);

router.post('/forgot-password', validator(requestResetSchema), authController.requestPasswordReset);
router.post('/verify-reset-code', validator(verifyCodeSchema), authController.verifyResetCode);
router.post('/reset-password', validator(resetPasswordSchema), authController.resetPassword);

module.exports = router;
