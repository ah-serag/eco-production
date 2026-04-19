const orderConfirmationEmail = ({
  name = "Valued Customer",
  orderId,
  total,
}) => {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return {
    subject: `Order Confirmed – GOTIY #${orderId}`,

    text: `Dear ${name},\n\nThank you for your order.\n\nOrder ID: #${orderId}\nDate: ${date}\nTotal: ${total}\n\nWe will notify you once your order has been shipped.\n\nWarm regards,\nGOTIY Customer Care`,

    html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Order Confirmed – GOTIY</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f5;">
<tr><td align="center">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

    <!-- ─── BRAND HEADER ─── -->
    <tr>
      <td style="background:#006988;padding:36px 40px 28px;text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:5px;color:rgba(255,255,255,0.55);text-transform:uppercase;font-weight:600;">
          Official Confirmation
        </p>
        <h1 style="margin:0;font-size:30px;letter-spacing:8px;color:#ffffff;font-weight:800;text-transform:uppercase;">
          GOTIY
        </h1>
      </td>
    </tr>


    <!-- ─── BODY ─── -->
    <tr>
      <td style="background:#ffffff;padding:40px 40px 32px;">

        <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">
          Dear Customer
        </p>
        <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#111;">
          ${name}
        </h2>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.75;color:#555;">
          Thank you for choosing <strong style="color:#111;">GOTIY</strong>.
        </p>

        <!-- ─── ORDER DETAILS BOX ─── -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8ec;overflow:hidden;margin-bottom:28px;">

          <tr>
            <td colspan="2" style="background:#f8f8fa;padding:14px 24px;border-bottom:1px solid #e8e8ec;">
              <span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:2px;">
                Order Summary
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 24px;border-bottom:1px solid #f0f0f3;width:50%;">
              <p style="margin:0 0 4px;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#111;font-family:'Courier New',monospace;">
                #${orderId}
              </p>
            </td>
            <td style="padding:18px 24px;border-bottom:1px solid #f0f0f3;width:50%;">
              <p style="margin:0 0 4px;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Date</p>
              <p style="margin:0;font-size:14px;font-weight:600;color:#333;">
                ${date}
              </p>
            </td>
          </tr>

          <tr>
            <td colspan="2" style="padding:18px 24px;">
              <p style="margin:0 0 4px;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Order Total</p>
              <p style="margin:0;font-size:24px;font-weight:800;color:#006988;">
                ${total}
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>

    <!-- ─── FOOTER ─── -->
    <tr>
      <td style="background:#006988;padding:28px 40px;text-align:center;">
        <p style="margin:0 0 6px;font-size:19px;font-weight:700;color:#eaeaea;letter-spacing:4px;text-transform:uppercase;">
          GOTIY
        </p>
        <p style="margin:0;font-size:11px;color:#eaeaea;line-height:1.6;">
          This is an automated message. Please do not reply directly to this email.<br/>
          © ${new Date().getFullYear()} GOTIY. All rights reserved.
        </p>
      </td>
    </tr>

  </table>

</td></tr>
</table>

</body>
</html>
`,
  };
};

module.exports = { orderConfirmationEmail };
