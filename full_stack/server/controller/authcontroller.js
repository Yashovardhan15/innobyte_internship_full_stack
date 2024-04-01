const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();

 exports.getprofile = async(req, res) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded;
    res.status(200).json({ decoded });
  });
}


 exports.postsignin = async(req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    await sendVerificationEmail(email, res);
  } catch (error) {
    console.error("Error occurred while saving user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
}

async function sendVerificationEmail(email, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });

  const OTPCode = generateOTP();

  const htmlContent = `
    <h2>Thank you for signing up with us and please use the below OTP to verify your email address </h2>
    <h3>Your OTP is:${OTPCode}</h3>
  `;

  try {
    const mail = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Verification Email",
      html: htmlContent,
    });

    console.log("Message sent: %s", mail.messageId);

    return res.status(201).json({
      status: true,
      message:
        "User created successfully. OTP has been sent to your email address",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to send OTP to your email" });
  }
}

function generateOTP() {
  return Math.floor(Math.random() * 899999 + 100000);
}


 exports.postlogin = async(req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY);
    res.cookie("jwt", token, { httpOnly: true, secure: true });

    res.status(200).json({ message: " Login successfull", token });
  } catch (error) {
    res.status(500).json({ error: " Server Error" });
  }
}


