const util = require("util");
const JWT = require("jsonwebtoken");
const schemas = require("../../models/index").schemas;

// const cryptoRandomString = require('crypto-random-string');
// const moment = require("moment");

const JWT_SECRET = process.env.JWTSECRET;

module.exports = {
	register: async (req, res, next) => {
		const user_data = req.body;

		// specify the user is not verified (for email verification)
		user_data.isverified = false;

		const UserModel = schemas.User;

		// check if there is a user with the email if there is no user, create them
		const user = new UserModel(user_data);

		user
			.save()

			.then(() => next())
			.catch((err) => {
				//uniqueness error
				if (err.code == 11000) {
					return res.status(401).send({ error: "email already in use" });
				}
				return res.status(500).send({ error: "trouble signing up" });
			});
	},

	signToken: (user) => {
		return JWT.sign(
			{
				iss: "songbird",
				sub: user.email,
				iat: new Date().getTime(), // current time
				exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead     })
			},
			JWT_SECRET
		);
	},

	sign_in: (req, res, next) => {
		const user = req.user;

		const token = module.exports.signToken(user);
		user.token = token;

		return next();
	},

	setJwtFromQuery: (req, res, next) => {
		token = req.query.token;
		req.headers.authorization = `Bearer ${token}`;
		next();
	},

	verifyUser: (req, res, next) => {
		schemas.User.findOneAndUpdate(
			{ email: req.user.email },
			{ isverified: true },
			(err, doc) => {
				if (err) return res.status(400).send({ error: "could not find email" });
				next();
			}
		);
	},

	updateUser: (req, res, next) => {
		schemas.User.findOneAndUpdate(
			{ email: req.user.email },
			req.body,
			(err, doc) => {
				if (err) return res.status(400).send({ error: "could not find email" });
				next();
			}
		);
	},
};
