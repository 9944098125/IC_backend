const db = require("../dbConfig/db");
const bcryptJs = require("bcryptjs");
const { sendRegistrationEmail } = require("../helpers/nodemailer");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
	try {
		const {
			name,
			email,
			password,
			profilePicture,
			country,
			address,
			isVendor,
			phone,
		} = req.body;
		const existingUserQuery = "SELECT * FROM users WHERE email = ?";
		db.query(existingUserQuery, [email], (err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					message: "Internal server error",
					status: 500,
					success: false,
				});
			}
			if (result.length > 0) {
				return res.status(400).json({
					message: `User already exists with this email ${email}`,
					status: 400,
					success: false,
				});
			}
			const saltRounds = bcryptJs.genSaltSync(10);
			const hashedPassword = bcryptJs.hashSync(password, saltRounds);
			const createUserQuery =
				"INSERT INTO users (name, email, password, profilePicture, country, address, isVendor, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
			const values = [
				name,
				email,
				hashedPassword,
				profilePicture,
				country,
				address,
				isVendor,
				phone,
			];
			db.query(createUserQuery, values, (err, result) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: "Internal server error",
						status: 500,
						success: false,
					});
				}
				sendRegistrationEmail(email, name);
				return res.status(201).json({
					message: "User registered successfully",
					status: 201,
					success: true,
				});
			});
		});
	} catch (err) {
		next(err);
	}
};

const login = async (req, res, next) => {
	const { emailOrPhone, password } = req.body;
	try {
		const isEmail = /^\S+@\S+\.\S+$/.test(emailOrPhone);
		let query, user;
		if (isEmail) {
			query = "SELECT * FROM users WHERE email = ?";
		} else {
			query = "SELECT * FROM users WHERE phone = ?";
		}
		db.query(query, [emailOrPhone], (err, result) => {
			if (err) {
				return res.status(404).json({ message: "Something went wrong !" });
			}
			if (result.length === 0) {
				return res.status(404).json({ message: "User not found !" });
			}
			user = result[0];
			const passwordMatches = bcryptJs.compareSync(password, user.password);
			if (!passwordMatches) {
				return res.status(400).json({ message: "Wrong password !" });
			}
			delete user.password;
			const token = jwt.sign(
				{
					userId: user.id,
					isVendor: user.isVendor,
				},
				process.env.SECRET_TOKEN
			);
			res.status(200).json({
				message: "Login Success",
				user: user,
				token: token,
			});
		});
	} catch (err) {
		next(err);
	}
};

module.exports = { register, login };
