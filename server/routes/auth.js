const express = require("express");
const upload = require("../middleware/upload");
// ...existing code...
const { loginUsingGoogle } = require("../controllers/auth/google");
const { signupManager,signUpUser, loginUser } = require("../controllers/userController");

const router = express.Router();

// Auth
router.post("/manager-signup", upload.single("profileImgURL"), signupManager);
router.post("/signup", upload.single("profileImgURL"), signUpUser);
router.post("/login", loginUser);
router.post("/google", loginUsingGoogle);

// ...existing code...

module.exports = router;
