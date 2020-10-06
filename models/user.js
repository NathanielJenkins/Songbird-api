const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
	},
	password: String,
	firstname: String,
	lastname: String,
	datecreated: Date,
	isverified: { type: Boolean, default: false },
	type: { type: Number, default: -1 },
	profile_id: { type: mongoose.Types.ObjectId, ref: "Profile", default: null },
});

UserSchema.statics.findByEmail = async function (email) {
	let user = await this.findOne({
		email: email,
	});
	return user;
};

UserSchema.statics.deleteByEmail = function (email) {
	this.deleteOne({ email }, (err, res) => {});
};

module.exports = mongoose.model("User", UserSchema);
