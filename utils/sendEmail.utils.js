const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (user) => {
  try {
    // 1. Setup transporter with email server info and login
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // implicit SSL/TLS
      auth: {
        user: "ebenezerflintwoodbrace@gmail.com",
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 2. Define email details
    const mailOptions = {
      from: `"JE-Advertisements" <JE-Advertisements@example.email>`,
      to: user.email,
      subject: "Welcome to JE-Advertisements",
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to JE-Advertisements</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Outfit", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #131220;
      }
a {
        font-style: none;
        color: inherit;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffe0e0;
        background: linear-gradient(
          24deg,
          rgba(255, 224, 224, 1) 0%,
          rgba(255, 255, 255, 1) 100%
        );
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.418);
        overflow: hidden;
      }

     .header {
        background: linear-gradient(0deg,rgba(255, 212, 212, 1) 0%, rgba(255, 212, 212, 1) 11%, rgba(255, 120, 120, 1) 100%);
        color: #120a27;
        padding: 30px 20px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.281);
        overflow: hidden;
      }

      .header h1,
      .header p {
        position: relative;
        z-index: 2; /* above overlay */
      }

      .header h1 {
        color: #000c1a;
        text-shadow: 3px 3px 8px white;
        margin: 0;
        font-size: 1.8rem;
        font-weight: 800;
        font-family: "Playfair Display", serif;
      }

      .header h1 span {
        font-size: 2rem;
      }

      .content {
        padding: 30px 20px;
      }

      .content h2 {
        color: #ff5353;
        margin-top: 0;
        font-family: "Playfair Display", serif;
      }

      .section {
        margin-bottom: 25px;
      }

      .section h3 {
        margin-bottom: 10px;
        color: #333;
        font-family: "Playfair Display", serif;
      }

      .button {
        display: inline-block;
        background-color: #ff5353;
        color: #000000;
        text-decoration: none;
        padding: 12px 25px;
        border-radius: 6px;
        font-weight: bold;
        margin-top: 20px;
      }

      .footer {
        font-size: 12px;
        text-align: center;
        color: #919090;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to <br /><span>JE-Advertisements</span></h1>
        <p>Your smart marketplace for posting and exploring quality adverts.</p>
      </div>

      <div class="content">
        <h2>Hello ${user.username},</h2>
        <p>
          Thanks for joining JE-Advertisements! Whether you're a vendor or a
          buyer, here's what you can expect:
        </p>

        <div class="section">
          <h3>For Vendors:</h3>
          <ul>
            <li>
              Post adverts using a simple form (title, description, image,
              price, category).
            </li>
            <li>
              Get instant feedback with success or error messages after posting.
            </li>
            <li>
              Use your dashboard to
              <strong>view, edit, and delete</strong> your adverts easily.
            </li>
          </ul>
        </div>

        <div class="section">
          <h3>For Users:</h3>
          <ul>
            <li>Browse all adverts in a clean grid or list layout.</li>
            <li>
              Use advanced search and filters by category, price, or keywords.
            </li>
            <li>
              View full details of each advert including images, prices, and
              descriptions.
            </li>
          </ul>
        </div>

        <p>Start exploring or managing your adverts below:</p>
        <a href="https://je-advertss.netlify.app" target="_blank" class="button"
          >Go to Your Dashboard</a
        >
      </div>

      <div class="footer">
        &copy; 2025 JE-Advertisements. All rights reserved.<br />
        You received this email because you signed up on our platform.
      </div>
    </div>
  </body>
</html>
`,
    };
    // 3. Send email and get info about it (Like a Reciept)
    const info = await transporter.sendMail(mailOptions);
    // 4. Log the email ID and get preview link (for Ethereal)
    console.log("Email Sent With Gmail", info);
    return {
      success: true,
    };
  } catch (error) {
    console.log("Email Error", error);
    return {
      success: false,
      error,
    };
  }
};

module.exports = sendEmail;
