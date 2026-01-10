const express = require("express");
const upload = require("../middleware/upload");
// ...existing code...
const { loginUsingGoogle } = require("../controllers/auth/google");
const { signupManager,signUpUser, loginUser } = require("../controllers/userController");
const otpController = require("../controllers/otpController");

const router = express.Router();

// Auth
router.post("/manager-signup", upload.single("profileImgURL"), signupManager);
router.post("/signup", upload.single("profileImgURL"), signUpUser);
router.post("/login", loginUser);
router.post("/google", loginUsingGoogle);

// Password reset / OTP routes
router.post("/forget-password", otpController.forgotPassword);
router.post("/forget-password-validate-otp", otpController.validateForgotOTP);
router.post("/set-new-password", otpController.newPassword);
router.post("/resend-otp", otpController.resentOTP);

// ...existing code...

module.exports = router;
