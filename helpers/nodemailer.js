const nodemailer = require("nodemailer");

async function sendRegistrationEmail(email, name) {
	try {
		// Create a transporter using your email service credentials
		const transporter = nodemailer.createTransport({
			service: "Gmail", // service provider
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_APP_PASSWORD,
			},
		});

		// Email content
		const mailOptions = {
			from: "srinivas72075@gmail.com", // Replace with your email address
			to: email,
			subject: "Use Instant_Click now for amazing products...",
			html: `
       You have successfully registered
       with us ${name}, Login and 
       enjoy shopping with us.
      `,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent for information", info);
	} catch (error) {
		console.error("Error sending email:", error);
	}
}

module.exports = { sendRegistrationEmail };
