import Agent from "../models/Agent.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const loginAgent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const agent = await Agent.findOne({ email });
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: Agent registration for testing (delete later)
export const registerAgent = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existing = await Agent.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Agent already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newAgent = await Agent.create({ name, email, phone, password: hash });
    res.status(201).json(newAgent);
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Generate reset token (expires in 15 minutes)
    const resetToken = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <h2 style="color: #333; margin: 0;">Flow Quint - Password Reset</h2>
        </div>
        <div style="padding: 20px; background: white;">
          <h3 style="color: #333;">Hello ${agent.name},</h3>
          <p style="color: #666; line-height: 1.6;">
            You requested a password reset for your Flow Quint account. Click the button below to reset your password.
          </p>
          <p style="color: #666; line-height: 1.6;">
            <strong>This link will expire in 15 minutes.</strong>
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated email from Flow Quint. Please do not reply.
          </p>
        </div>
      </div>
    `;

    await sendEmail(agent.email, "Password Reset Request - Flow Quint", html);
    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agent = await Agent.findById(decoded.id);
    
    if (!agent) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the agent's password
    agent.password = hashedPassword;
    await agent.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Reset link has expired" });
    }
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
