const confirmationEmail = ({ name = "User", confirmUrl }) => {
  return {
    subject: "Confirm Your Account – Market",
    text: `Hi ${name},

Thanks for signing up at Market!

Please confirm your email address by clicking the link below:
${confirmUrl}

If you did not create this account, you can safely ignore this email.

Regards,
Market Team`,
    
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0b2546;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" 
         style="max-width:600px;margin:36px auto;background:#ffffff;border-radius:10px;overflow:hidden;
         box-shadow:0 6px 18px rgba(11,37,70,0.08);">

    <!-- Header -->
    <tr>
      <td style="padding:24px;text-align:center;
                 background:linear-gradient(90deg,#0b6bf0 0%,#2e9ef9 100%);color:#fff;">
        <h1 style="margin:12px 0;font-size:24px;font-weight:700;">Market</h1>
        <p style="margin:0;font-size:14px;opacity:0.95;">
          Welcome to Market
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:28px;">
        <h2 style="margin:0 0 12px;font-size:18px;color:#0b2546;">
          Hi ${name},
        </h2>

        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#52607a;">
          Thank you for creating an account at Market!  
          Please confirm your email address to activate your account.
        </p>

        <div style="text-align:center;margin:26px 0;">
          <a href="${confirmUrl}" target="_blank" 
             style="display:inline-block;padding:12px 24px;border-radius:8px;text-decoration:none;
             font-weight:600;background:#0b6bf0;color:#fff;
             box-shadow:0 4px 14px rgba(11,107,240,0.25);">
            Confirm Your Email
          </a>
        </div>

        <p style="font-size:13px;color:#7b8aa3;margin:10px 0;">
          If you did not create this account, just ignore this email.
        </p>

        <hr style="border:none;border-top:1px solid #eef3fb;margin:22px 0;" />

        <p style="font-size:12px;color:#9aa9c6;margin:0;">
          Regards,<br>
          Market Team
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`
  };
};

module.exports = { confirmationEmail };
