const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohamedmahmoud6524@gmail.com',
        subject: 'Welcome for joining us',
        text: `Welcome to task manager app, ${name}. we hope to get a great experiment`
    })
}

const sendDeleteEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohamedmahmoud6524@gmail.com',
        subject: 'Inquiry',
        text: `We are so sad to lose you ${name}, Please let us know about the reasons for deleting your account`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}
