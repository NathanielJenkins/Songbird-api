const env = require("dotenv").config();
const express = require("express");
const connectDb = require("./models/index").connectDb;
const cors = require("cors");

app = express();
app.use(express.json());
app.use(cors());

//add the routes
app.use("/", require("./app/routes/approutes"));
//connect to the database and run the server

connectDb()
	.then(async () => {
		app.listen(process.env.PORT, () =>
			console.log(`songbird listening on port localhost/${process.env.PORT}!`)
		);
	})
	.catch(() => {
		console.log("could not connect to the database");
	});
