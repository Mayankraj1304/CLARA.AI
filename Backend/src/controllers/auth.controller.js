import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    if (isUserAlreadyExists.email === email) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
        err: "User already exists",
      });
    }
    if (isUserAlreadyExists.username === username) {
      return res.status(400).json({
        message: "User with this username already exists",
        success: false,
        err: "User already exists",
      });
    }
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to CLARA.AI!",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your CLARA.AI account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #1f2937;">
  
  <!-- Hidden Preheader Text for Email Clients -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    Complete your CLARA.AI registration by verifying your email address.
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header / Logo Area -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: left; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #0d9488;">CLARA.AI</span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">Verify your email address</h1>
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                Hi <strong>${username}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                Welcome to CLARA.AI! To complete your registration and secure your account, please verify your email address below.
              </p>

              <!-- Primary CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #0d9488;">
                    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" target="_blank" style="font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block; border: 1px solid #0d9488;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.5; color: #6b7280;">
                ⏱️ This verification link will expire in <strong>24 hours</strong>.
              </p>

              <!-- Fallback Link Section -->
              <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 12px; font-size: 12px; color: #6b7280; word-break: break-all;">
                If the button above doesn't work, copy and paste this URL into your browser:<br>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" style="color: #0d9488; text-decoration: underline;">http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">If you did not create an account with CLARA.AI, please ignore this email or contact support if you have concerns.</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} CLARA.AI Inc. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "User not found",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "Incorrect password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
        err: "User not found",
      });
    }

    user.verified = true;

    await user.save();

    const html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 420px; margin: 60px auto; padding: 40px 32px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); text-align: center;">
  
  <!-- Success Icon -->
  <div style="width: 60px; height: 60px; background-color: #ccfbf1; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
    <svg style="width: 30px; height: 30px; color: #0d9488;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
    </svg>
  </div>

  <!-- Heading -->
  <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 10px 0; letter-spacing: -0.02em;">
    Email Verified Successfully!
  </h1>

  <!-- Description -->
  <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
    Your email has been verified. Redirecting to login in <strong id="countdown" style="color: #0d9488;">5</strong> seconds...
  </p>

  <!-- Login Button -->
  <a href="http://localhost:3000/login" style="display: block; width: 100%; box-sizing: border-box; background-color: #0d9488; color: #ffffff; font-size: 14px; font-weight: 600; padding: 12px 20px; border-radius: 8px; text-decoration: none;">
    Go to Login
  </a>

  <!-- Pure JavaScript Auto-Redirect -->
  <script>
    (function() {
      var seconds = 5;
      var countdownEl = document.getElementById('countdown');
      var targetUrl = 'http://localhost:3000/login';

      var timer = setInterval(function() {
        seconds--;
        if (countdownEl) countdownEl.textContent = seconds;
        
        if (seconds <= 0) {
          clearInterval(timer);
          window.location.href = targetUrl;
        }
      }, 1000);
    })();
  </script>
</div>`;

    return res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
}
