const { Router } = require("express");
const router = Router();

const catchErrors = require("../middleware/catchErrors");
const stripe = require("stripe")(process.env.STRIPE_TOKEN);
const User = require("../models/User");
const { ensureUser } = require("../middleware/auth");
const handleJsonValidator = require("../helpers/handleJsonValidator");
const newPaymentSchema = require("../jsonschemas/payments/new.json");
const calcTotalAmount = require("../helpers/calcTotalAmount");

router.post("/", [ensureUser],
	catchErrors(async (req, res) => {
		handleJsonValidator(req.body, newPaymentSchema);
		// get the user data
		const user = await User.getById(res.user.id);
		// get the payment amount
		const amount = await calcTotalAmount(req.body.items);

		// create the payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount, currency: "usd", customer: user.stripeId
		});

		return res.status(201).json({
			clientSecret: paymentIntent.client_secret
		});
	})
);

module.exports = router;
