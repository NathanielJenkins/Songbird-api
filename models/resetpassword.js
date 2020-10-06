const mongoose = require("mongoose");

const VerifyUserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
	},
	token: String,
});

module.exports = mongoose.model("VerifyUser", VerifyUserSchema);
