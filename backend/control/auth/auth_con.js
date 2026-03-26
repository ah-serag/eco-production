const pool = require("../../config/condb");
const bcrypt =  require("bcrypt") 
const { generateAccessToken, generateRefreshToken, verifyRefreshToken} = require("../../utils/jwt")

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    const userCheck = await pool.query(`SELECT id, role FROM users WHERE email = $1`, [email]);
    const existingUser = userCheck.rows[0];

    const password_hash = await bcrypt.hash(password, 10);
    let user;

    if (existingUser) {

     if (existingUser.role === "guest") {
        const updateResult = await pool.query(
          `UPDATE users 
           SET full_name = $1, password_hash = $2, role = 'user' 
           WHERE id = $3 
           RETURNING id, full_name, email`,
          [full_name, password_hash, existingUser.id]
        );
        user = updateResult.rows[0];
      } else {
        return res.status(409).json({ message: "Email is already registered as a member." });
      }
      } else {
      const insertResult = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, role)
         VALUES ($1, $2, $3, 'user') 
         RETURNING id, full_name, email`,
        [full_name, email, password_hash]
      );
      user = insertResult.rows[0];
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [
      refreshToken,
      user.id
    ]);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(existingUser ? 200 : 201).json({
      message: existingUser 
        ? `${user.full_name}, your guest account has been updated to a full member.` 
        : `${user.full_name}, your account was created.`,
      user: user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




const sign_in = async (req, res) => {
  try {
    const {  email  , password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password are required." });
    }

    const getUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (!getUser.rows.length) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const user = getUser.rows[0];

  
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
     secure: true, // false 
     sameSite: "none" , // lax 
     maxAge: 15 * 60 * 1000,
     path: "/",
   });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      ok: true,
      message: "Login successful",
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
      return res.status(403).json({ message: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    // DB
    const { rows } = await pool.query(
      "SELECT id, role FROM users WHERE id = $1 AND refresh_token IS NOT NULL",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Create new access token
    const accessToken = generateAccessToken(rows[0].id);
     
    res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: true,  
     sameSite: "none" ,
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




module.exports = {register  , sign_in ,refresh , logOut}