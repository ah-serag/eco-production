const pool = require("../../config/condb");
const bcrypt =  require("bcrypt") 
const {generateEmailToken, verifyEmailToken, generateAccessToken, generateRefreshToken, verifyRefreshToken} = require("../../utils/jwt")
const {confirmationEmail} = require("../../config/emailTemplete");
const sendMailNodemailer = require("../../config/nodemailer");

const register = async (req, res) => {
  try {
    const { full_name, username, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    // Check email
    const emailCheck = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Check phone
    if (phone) {
      const phoneCheck = await pool.query(`SELECT id FROM users WHERE phone = $1`, [phone]);
      if (phoneCheck.rows.length > 0) {
        return res.status(409).json({ message: "Phone number is already registered." });
      }
    }

    // Check username
    if (username) {
      const usernameCheck = await pool.query(`SELECT id FROM users WHERE username = $1`, [username]);
      if (usernameCheck.rows.length > 0) {
        return res.status(409).json({ message: "Username is already taken." });
      }
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (full_name, username, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, username, email, phone, role, is_verified, is_active, created_at`,
      [full_name, username || null, email, phone || null, password_hash]
    );

    const newUser = result.rows[0];

    // Send verification email
    const tokenEmail = generateEmailToken(newUser.id);
    const urlToConfirm = `${process.env.FRONT_END_URL}/auth/confirm?token=${tokenEmail}`;

    const { subject, text, html } = confirmationEmail({
      name: newUser.full_name,
      confirmUrl: urlToConfirm
    });

    await sendMailNodemailer({
      to: "aserag877@gmail.com",
      subject,
      text,
      html
    });

    return res.status(201).json({
      message: `${newUser.full_name}, your account was created! Please verify your email.`,
      user: newUser
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const confirm = async (req, res) => {
  
  const { token } = req.body;

  const decoded = verifyEmailToken(token);

  if (!decoded.valid) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }

  // Ensure user exists
  const checkUser = await pool.query(`SELECT id FROM users WHERE id = $1`, [decoded.id]);
  if (!checkUser.rows.length) {
    return res.status(404).json({ message: "User not found." });
  }

  await pool.query(`UPDATE users SET is_verified = true WHERE id = $1`, [decoded.id]);
  await pool.query(`UPDATE users SET is_active = true WHERE id = $1`, [decoded.id]);

  res.json({ message: "Your account has been successfully verified!" });
};



const sign_in = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password are required." });
    }

    const getUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (!getUser.rows.length) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const user = getUser.rows[0];

    if (!user.is_verified) {
      const tokenEmail = generateEmailToken(user.id);
      const urlToConfirm = `${process.env.FRONT_END_URL}/auth/confirm?token=${tokenEmail}`;

      const { subject, text, html } = confirmationEmail({
        name: user.full_name,
        confirmUrl: urlToConfirm
      });

      await sendMailNodemailer({ to: user.email, subject,text,  html });

      return res.status(403).json({
        ok: false,
        message: "Please verify your email. A new verification link has been sent."
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ ok: false, message: "Incorrect password" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [
      refreshToken,
      user.id
    ]);


    res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "lax",
     maxAge: 15 * 60 * 1000,
     path: "/",
   });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name ,
        role:user.role ,
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};


const refresh = async (req ,res )=>{
 try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    // DB
    const { rows } = await pool.query(
      "SELECT id, role FROM users WHERE id = $1 AND refresh_token IS NOT NULL",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Create new access token
    const accessToken = generateAccessToken(rows[0].id);
     
    res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "lax",
     maxAge: 15 * 60 * 1000,
     path: "/",
   });


    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}


const logOut =  (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
} ;




module.exports = {register , confirm , sign_in ,refresh , logOut}