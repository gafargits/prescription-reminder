const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (from, to, subject, messageContent, send_at) => {
  
  const message = {
    from,
    to,
    subject,
    text: messageContent,
    send_at
  }

  sgMail.send(message)
  .then(() => {}, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  });
}

module.exports = sendMail