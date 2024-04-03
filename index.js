require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoute = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
	const errMessage = err.message;
	const errStatus = err.status;
	return res.status(errStatus).json({
		message: errMessage,
		status: errStatus,
		stack: err.stack,
		success: false,
	});
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
