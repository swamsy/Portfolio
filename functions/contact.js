const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
require('dotenv').config();

let accessToken;
const tokenGenerator = xoauth2.createXOAuth2Generator({
    user: process.env.GMAIL_USERNAME,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENTSECRET,
    refreshToken: process.env.OAUTH_REFRESHTOKEN
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USERNAME,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENTSECRET,
        refreshToken: process.env.OAUTH_REFRESHTOKEN,
        accessToken: accessToken
    }
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {statusCode: 405, body: "Method Not Allowed"};
  }

  const body = JSON.parse(event.body);

  const mailOptions = {
      from: body.email,
      to: process.env.GMAIL_USERNAME,
      subject: `New Message From ${body.formName}`,
      text: `Name: ${body.formName}\nEmail: ${body.email}\nMessage: ${body.message}`,
  }

  try {
      const token = await new Promise((resolve, reject) => {
        tokenGenerator.getToken((err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
      });

      // Update transporter with new access token
      transporter.set('options.auth.accessToken', token.accessToken);
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return {
        statusCode: 200,
        body: JSON.stringify({status: 'success'}),
      };
  } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({status: 'error'}),
      };
    }
};