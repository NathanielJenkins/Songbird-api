const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
	photos: [{ class: String, uri: String }],
	description: { type: String },
});

module.exports = mongoose.model("Profile", ProfileSchema);
