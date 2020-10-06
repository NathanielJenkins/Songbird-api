const nodemailer = require("nodemailer");
const Email = require("email-templates");
const { signToken } = require("./users");
const { User } = require("../../models/index").schemas;

let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAILUSERNAME,
		pass: process.env.EMAILPASSWORD,
	},
});

module.exports = {
	// send mail with defined transport object
	reset_password: (req, res, next) => {
		const email = new Email({
			transport: transporter,
			send: true,
			preview: false,
		});

		email
			.send({
				template: "mars",
				message: {
					to: "njboale@gmail.com",
				},
				locals: {
					name: "Elon",
				},
			})
			.then(() => console.log("email has been send!"));
		//     transporter.sendMail({
		//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
		//     to: "njboale@gmail.com", // list of receivers
		//     subject: "Hello ✔", // Subject line
		//     text: "Hello world?", // plain text body
		//     html: "<b>Hello world?</b>" // html body
		// })
		next();
	},

	register_email: (req, res, next) => {
		const email = new Email({
			transport: transporter,
			send: true,
			preview: false,
		});

		const user_data = req.body;

		const verificationToken = signToken(user_data);
		email
			.send({
				template: "register_email",
				subject: "verify your email",
				message: {
					from: process.env.EMAILUSERNAME,
					to: user_data.email,
				},
				locals: {
					url: `${process.env.API_URL}/verify_user?token=${verificationToken}`,
				},
			})
			.then(() => next())
			.catch((error) => {
				//delete the user from the user table since the email was not sent
				User.deleteByEmail(user_data.email);
				return res.status(500).send({ error: "Please try again" });
			});
	},
};
