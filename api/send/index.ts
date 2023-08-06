const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const RESEND_API_KEY = 're_d68mKRsF_HBaYqSuFRWEdkWMmNs6D6CeG';

app.post('*', async function (req, res) {
    const email = req.body.email;
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: 'ChatDB <onboarding@chatdb.ai>',
            to: [email],
            subject: 'Welcome from the ChatDB Team 👋',
            reply_to: 'cfahlgren1@gmail.com',
            html: `
            <h2 style={{ color: '#333' }}>Hey there!</h1>
            <p>
                Thank you for signing up to the ChatDB waitlist. We're thrilled to have you on board!
            </p>
            <p>
                Our team is working hard to provide you with the best chat database service. You'll be among the first to know when we launch.
            </p>
            <p>
                Thank you once again for your interest and support.
            </p>
            <p>
                Best regards,<br />
                The ChatDB Team
            </p>
            `,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        res.json(data);
    } else {
        res.status(500).send("Error sending email");
    }
});

module.exports = app;


export { };