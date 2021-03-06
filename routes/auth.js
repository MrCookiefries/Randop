const { Router } = require("express");
const router = Router();

const catchErrors = require("../middleware/catchErrors");
const User = require("../models/User");
const handleJsonValidator = require("../helpers/handleJsonValidator");
const loginSchema = require("../jsonschemas/auth/login.json");
const createToken = require("../helpers/createToken");

/**
 * takes a email & password to login,
 * making a new JWT & returning it with the user
 */
router.post("/", catchErrors(async (req, res) => {
	handleJsonValidator(req.body, loginSchema);
	const user = await User.login(req.body);
	const token = createToken(user);
	return res.status(201).json({ user, token });
}));

module.exports = router;
