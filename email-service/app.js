const sendMail = require("./transporter");

const mailList = ["nguyenduckhai8101@gmail.com", "19521658@gm.uit.edu.vn"];

(async () => {
	await sendMail(mailList);
})();
