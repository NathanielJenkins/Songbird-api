const Joi = require("@hapi/joi");

module.exports = {
	validateBody: (schema) => {
		return (req, res, next) => {
			const result = Joi.validate(req.body, schema);
			if (result.error) {
				return res.status(400).json(result.error);
			}
			next();
		};
	},

	schemas: {
		authSchema: Joi.object().keys({
			firstname: Joi.string().min(1).max(15).required().trim(),
			lastname: Joi.string().min(1).max(15).required().trim(),
			email: Joi.string().email().required().trim(),
			password: Joi.string().min(5).required().trim(),
		}),

		loginSchema: Joi.object().keys({
			email: Joi.string().email().required().trim(),
			password: Joi.string().min(5).required().trim(),
		}),
	},
};
