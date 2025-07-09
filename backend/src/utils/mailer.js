const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,         // smtp.gmail.com
  port: process.env.SMTP_PORT,         // 587
  secure: false,                       // must be false for port 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,       // ishusitikhu6@gmail.com
    pass: process.env.SMTP_PASSWORD,   // Gmail app password
  },
  tls: {
    rejectUnauthorized: false,         // ✅ Fixes "self-signed certificate" error
  },
});

module.exports = transporter;
