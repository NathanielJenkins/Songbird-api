const ProfileModel = require("../../models/index").schemas.Profile;

module.exports = {
	get_header_photos: (req, res, next) => {
		//add the photo to the photos document
		// ProfileModel.findOneAndUpdate({})
		next();
	},
};
