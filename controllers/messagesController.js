const nodemailer = require('nodemailer');

// Function to handle the contact form submission and send email
exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;
  const subject = name + " New Message";
  console.log(process.env.GUNMAIL_EMAIL,process.env.GUNMAIL_PASS,name,email,subject,message)
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Create a transporter object with your email configuration
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: process.env.GUNMAIL_USERNAME,
          pass: process.env.GUNMAIL_PASS,
        },
    });

    

    // Set email options
    const mailOptions = {
      from: process.env.GUNMAIL_EMAIL, // Sender address (the email provided in the form)
      to: process.env.EMAIL, // The email address you want to send the message to
      subject: subject,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send the message.' });
  }
};
