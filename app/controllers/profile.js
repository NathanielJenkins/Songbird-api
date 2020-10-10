const schemas = require("../../models/index").schemas;

module.exports = {
	generateDefaultUserProfile: (req, res, next) => {
		//check if there already is a profile associated with this user
		if (!req.user.profile_id) {
			//create the default profile
			const profile = new schemas.Profile({
				group_name: `${req.user.firstname} ${req.user.lastname}`,
			});

			profile
				.save()
				.then((profile) => {
					//update the reference in the user table
					schemas.User.findByIdAndUpdate(req.user._id, {
						profile_id: profile._id,
					}).then(next());
				})

				.catch((err) => {
					return res.status(200).send({
						success: false,
						message: "Could not successful create the user profile",
					});
				});

			//there is already a profile id
		} else {
			return res.status(200).send({
				success: false,
				message: "already a user profile associated with this account",
			});
		}
	},

	getProfile: (req, res, next) => {
		schemas.Profile.findById(req.user.profile_id, (err, profile) => {
			if (err)
				return res.status(200).send({
					success: false,
					message: "Could not find user profile",
				});

			//set the req body
			req.body.profile = profile;
			next();
		});
	},

	updateProfile: (req, res, next) => {
		schemas.Profile.findByIdAndUpdate(
			req.user.profile_id,
			req.body.profile,
			(err, profile) => {
				if (err) {
					console.log(err);
					return res.status(200).send({
						success: false,
						message: "Could not find user profile",
					});
				}
				//set the req body
				req.body.profile = profile;
				next();
			}
		);
	},
};
