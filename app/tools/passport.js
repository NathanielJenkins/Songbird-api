// Passport authentication
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
	ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const JWT_SECRET = process.env.JWTSECRET;

//Hashing and encrypting
const bcrypt = require("bcryptjs");

//databases
const schemas = require("../../models/index").schemas;

//Local strategy
/**
 * Notice, passport requires username, we will treat it either as an email or a username
 */
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
		},
		async (email, password, done) => {
			//Find the user given the username
			const UserModel = schemas.User;
			const db_user = await UserModel.findByEmail(email);

			//they do not exist
			if (!db_user) return done(null, false);

			// they are not verified
			if (!db_user.isverified) return done(null, false);

			//Check if the password is correct
			bcrypt.compare(password, db_user.password, function (err, res) {
				if (err) return done(err, false);
				delete db_user.password;

				//probably don't need to create a new user object here.
				//but it might be more reable what is part of the object
				if (res) {
					const user = {
						firstname: db_user.firstname,
						lastname: db_user.lastname,
						email: db_user.email,
						type: db_user.type,
					};
					return done(null, user);
				} else return done(null, false);
			});
		}
	)
);

//JSON web token strategy
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: JWT_SECRET,
		},
		async (payload, done) => {
			let email = payload.sub;

			//Find the user given the email
			const UserModel = schemas.User;
			const user = await UserModel.findByEmail(email);

			//they do not exist
			if (!user) return done(null, false);

			//they do exist
			return done(null, user);
		}
	)
);
