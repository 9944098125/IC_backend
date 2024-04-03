const mysql = require("mysql2");

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

db.getConnection((err) => {
	if (err) {
		console.log(`Error connecting to database: ${err}`);
	} else {
		console.log(`Successfully Connected to database`);
	}
});

module.exports = db;
