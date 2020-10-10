// express related modules
const express = require("express");
const cors = require("cors");

const router = express.Router();
router.use(cors());

const bodyParser = require("body-parser");
router.use(bodyParser.json());

//authentication related modules
const passportConf = require("../tools/passport");
const passport = require("passport");
const { validateBody, schemas } = require("../tools/validate");

//controllers
const user_controller = require("../controllers/users");
const random_controller = require("../controllers/random");
const email_controller = require("../controllers/email");
const upload_controller = require("../controllers/upload");
const profile_controller = require("../controllers/profile");

/**
 * Test route
 */
router.all("/", async (req, res) => {
	return res.status(200).send("Hello Wor... *cough*.. Hello SongBird :)");
});

/** */
router.all(
	"/protected_route",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		return res.status(200).send("protected route success");
	}
);

/**
 * req.body {
 *  email :
 *  firstname
 *  lastname
 *  password
 * }
 */
router.post(
	"/register",
	validateBody(schemas.authSchema),
	random_controller.hash_pass,
	user_controller.register,
	// email_controller.register_email,
	(req, res) => {
		return res.status(200).send({ message: "Please verify your email" });
	}
);

/**
 * req.body {
 *  email
 *  password
 * }
 */
router.post(
	"/login",
	validateBody(schemas.loginSchema),
	passport.authenticate("local", { session: false }),
	user_controller.sign_in,
	(req, res) => {
		res.status(200).send(req.user);
	}
);

/** req.body {
 *  email
 * } */
router.post(
	"/reset_password",
	validateBody(schemas.resetPassword),
	email_controller.reset_password,
	(req, res) => {
		return res.status(200).send("Done");
	}
);

/** req.query
 * token
 */
router.get(
	"/reset_password_confirm",
	user_controller.setJwtFromQuery,
	passport.authenticate("jwt", { session: false }),
	(req, res, next) => {
		//change the password to the password in the body ?
		return res.status(200).send({ authorization: "success" });
	}
);

router.get(
	"/verify_user",
	user_controller.setJwtFromQuery,
	passport.authenticate("jwt", { session: false }),
	user_controller.verifyUser,
	(req, res) => {
		return res.status(200).send("Successfully Verified Email, Please log in");
	}
);

router.patch(
	"/update_user",
	passport.authenticate("jwt", { session: false }),
	user_controller.updateUser,
	(req, res) => {
		return res.status(200).send("Successfully updated the user");
	}
);

router.post(
	"/upload",
	passport.authenticate("jwt", { session: false }),
	upload_controller.uploadImageS3,
	upload_controller.uploadImageDB,
	(req, res) => {
		return res
			.status(200)
			.send({ success: true, message: "Successfully uploaded image" });
	}
);

router.post(
	"/generate_default_profile",
	passport.authenticate("jwt", { session: false }),
	profile_controller.generateDefaultUserProfile,
	(req, res) => {
		return res.status(200).send({
			success: true,
			message: "Successfully created a default user profile",
		});
	}
);
router.get("/test_aws", (req, res) => {
	console.log("inside of testing aws");
	s3.getObject({});
	return res.status(200).send("success");
});

router.get(
	"/get_profile",
	passport.authenticate("jwt", { session: false }),
	profile_controller.getProfile,
	(req, res) => {
		return res.status(200).send({ success: true, profile: req.body.profile });
	}
);

router.post(
	"/update_profile",
	passport.authenticate("jwt", { session: false }),
	profile_controller.updateProfile,
	(req, res) => {
		return res.status(200).send({
			success: true,
			message: "Successfully updated user profile",
		});
	}
);
//export the router
module.exports = router;
