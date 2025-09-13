const nodeMailer = require("nodemailer");
module.exports.sendMail = async (email, subject, htmlContent) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject, // tiêu đề
    html: htmlContent, // nội dung html
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};
