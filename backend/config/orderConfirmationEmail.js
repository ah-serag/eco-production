const orderConfirmationEmail = ({
  name = "Customer",
  orderId,
  total
}) => {
  return {
    subject: `Your Order is Confirmed – GOTIY (#${orderId})`,

    text: `Hi ${name},
Your order #${orderId} has been confirmed.
Total: ${total}
We will notify you once it ships.`,

    html: `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width"/>
</head>

<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);">

  <!-- HEADER -->
  <tr>
    <td style="padding:32px 32px 24px;text-align:center;background:#9a0029;">
      <h1 style="margin:0;font-size:26px;letter-spacing:6px;color:#fff;font-weight:700;">
        GOTIY
      </h1>
    </td>
  </tr>

  <!-- SUCCESS ICON -->
  <tr>
    <td style="text-align:center;padding:30px 32px 10px;">
    <table align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td 
      width="56" 
      height="56" 
      align="center" 
      valign="middle"
      style="border-radius:50%;background:#e8f7ee;text-align:center;line-height:56px;"
    >
      <span style="font-size:26px;color:#16a34a;display:inline-block;line-height:1;">
        ✓
      </span>
    </td>
  </tr>
</table>

      <h2 style="margin:16px 0 6px;font-size:22px;font-weight:700;">
        Order Confirmed
      </h2>

      <p style="margin:0;color:#666;font-size:14px;">
        Thank you for your purchase
      </p>
    </td>
  </tr>

  <!-- CONTENT -->
  <tr>
    <td style="padding:30px 32px;">

      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#333;">
        Hi <strong>${name}</strong>,<br/>
        Your order has been successfully placed. We’re currently preparing it and will notify you as soon as it ships.
      </p>

      <!-- ORDER BOX -->
      <div style="border:1px solid #eee;border-radius:12px;padding:20px;background:#fafafa;">

        <table width="100%" cellpadding="0" cellspacing="0">

          <tr>
            <td style="padding-bottom:12px;">
              <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">
                Order ID
              </span><br/>
              <strong style="font-size:16px;">#${orderId}</strong>
            </td>
          </tr>

          <tr>
            <td style="padding-top:12px;border-top:1px solid #eee;">
              <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">
                Total
              </span><br/>
              <strong style="font-size:20px;color:#111;">${total}</strong>
            </td>
          </tr>

        </table>

      </div>

      <!-- CTA BUTTON -->
      <div style="text-align:center;margin-top:30px;">
        <a href="${process.env.FRONT_END_URL}/en/orders"   style="display:inline-block;padding:14px 28px;background:#9a0029;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
          View Order
        </a>
      </div>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="padding:24px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;font-size:13px;color:#555;">
        GOTIY Team
      </p>
      <p style="margin:6px 0 0;font-size:12px;color:#aaa;">
        This is an automated email — please do not reply.
      </p>
    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
  };
};

module.exports = { orderConfirmationEmail };