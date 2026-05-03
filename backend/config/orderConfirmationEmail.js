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

    text: `Hello ${name},\n\nYour order is confirmed and being prepared with care.\n\nOrder ID: #${orderId}\nDate: ${date}\nTotal: ${total}\n\nA shipping confirmation with tracking details will follow soon.\n\n— GOTIY Studio`,

    html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Order Confirmed – GOTIY</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f3;padding:0;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;overflow:hidden;border:1px solid #e8e8e6;">

  <!-- Header -->
  <tr>
    <td style="padding:17px 30px 17px;border-bottom:13px solid #f1f1f1;background:#00235e;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0;font-size:31px;letter-spacing:3px;color:#ffffff;text-transform:uppercase;font-weight:700;">GOTIY
            <p style="margin:0;font-size:17px;font-weight:400;color:#ffffff;letter-spacing:-0.5px;padding:0 0 0 5px">Order confirmed</p>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:28px 40px;">
      <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7;">
        Hello <strong style="color:#111;font-weight:500;">${name}</strong>, your order is being prepared with care and will be on its way soon.
      </p>

      <!-- Order details block -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ebebea;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #ebebea;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:11px;color:#aaa;letter-spacing:1px;text-transform:uppercase;">Order ID</td>
                <td align="right" style="font-size:13px;font-weight:500;color:#111;font-family:monospace;">#${orderId}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #ebebea;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:11px;color:#aaa;letter-spacing:1px;text-transform:uppercase;">Date</td>
                <td align="right" style="font-size:13px;color:#666;">${date}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px;background:#fafaf9;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:11px;color:#aaa;letter-spacing:1px;text-transform:uppercase;">Total</td>
                <td align="right" style="font-size:20px;font-weight:400;color:#111;">${total}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Info banner -->
      // <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8f1fb;border-radius:8px;">
      //   <tr>
      //     <td style="padding:14px 16px;font-size:12px;color:#185FA5;line-height:1.6;">
      //       &#9432;&nbsp; A shipping confirmation with tracking details will be sent to your email.
      //     </td>
      //   </tr>
      // </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:20px 40px;border-top:1px solid #f0f0ee;background:#00235e;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:11px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">GOTIY.COM</td>
          <td align="right">
            <span style="font-size:11px;color:#ffffff;margin-left:16px;">Privacy</span>
            <span style="font-size:11px;color:#ffffff;margin-left:16px;">Support</span>
          </td>
        </tr>
      </table>
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