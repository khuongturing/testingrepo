import 'dotenv/config';
import sgMail from '@sendgrid/mail';

/**
  * @description - This function sends an email
  * @param {object} options - It contains the sender, destination,
  * subject of the mail, the html and text version of the mail content
  * @returns {void} - It doesn't return any value
  */
const sendMail = (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const mailMessage = options;
  sgMail.send(mailMessage);
};

export default sendMail;
