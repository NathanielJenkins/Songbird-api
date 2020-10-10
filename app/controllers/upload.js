var AWS = require("aws-sdk");
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const schemas = require("../../models/index").schemas;

//image upload
const multer = require("multer");
const multerS3 = require("multer-s3");

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.AWS_SONGBIRD_BUCKET,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(null, `${file.originalname}/${req.user._id}`);
		},
	}),
}).single("fileData");

module.exports = {
	//add image reference to database
	uploadImageDB: (req, res, next) => {
		//get the profile id(
		schemas.User.findById(req.user._id, (err, user) => {
			if (err)
				return res.status(200).send({
					success: false,
					message: "Unable to add the reference to the database",
				});
		}).then((user) => {
			console.log(user.profile_id);
			schemas.Profile.findByIdAndUpdate(user.profile_id, {
				header_screen: req.file.location,
			}).then(next());
		});
	},

	uploadImageS3: (req, res, next) => {
		upload(req, res, next, (err) => {
			if (err) {
				return res
					.status(200)
					.send({ success: false, message: "Unable to upload photo" });
			}
			console.log(req);
			next();
		});
	},

	deleteImageS3: (req, res, next) => {
		//delete the photo from the s3 server
		s3.deleteObject(
			{
				Bucket: process.env.AWS_SONGBIRD_BUCKET,
				Key: req.file.key,
			},
			(err, data) => {
				if (err)
					return res
						.status(200)
						.send({ success: false, message: "Failed to delete photo" });
				next();
			}
		);
	},
};
