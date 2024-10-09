const nodemailer = require('nodemailer');

// Handle the contact form submission and send email
exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;
  const subject = name + " New Message";
  console.log(process.env.GUNMAIL_EMAIL, process.env.GUNMAIL_PASS, name, email, subject, message)
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Create an object with email config
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      auth: {
        user: process.env.GUNMAIL_USERNAME,
        pass: process.env.GUNMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GUNMAIL_EMAIL, // Email provided in the form by user
      to: process.env.EMAIL, // Destination mail
      subject: subject,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send the message.' });
  }
};
