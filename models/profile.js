const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
	group_name: { type: String, default: "Group Name" },
	photos: [{ class: String, uri: String }],
	description: {
		type: String,
		default: "please enter a description of the group",
	},
	header_screen: {
		type: String,
		default:
			`${process.env.AWS_S3_BASE_URL}header/musicianbanner.jpg`
	},
});

module.exports = mongoose.model("Profile", ProfileSchema);
