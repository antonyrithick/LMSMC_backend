const { google } = require("googleapis");
const User = require("../models/userModel");

// const oauth2Client = new google.auth.OAuth2(

// );

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

// ✅ Step 1: Generate the Google consent URL
exports.initiateGoogleAuth = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
      state: userId.toString(),
    });

    res.json({ authUrl });
  } catch (err) {
    console.error("Initiate Google Auth Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Step 2: Handle the callback after Google approves
exports.googleAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state;
console.log("Google OAuth Callback received with code:", code, "and state(userId):", state);
    if (!code || !userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
      googleTokenExpiry: tokens.expiry_date,
    });

    // Redirect back to frontend with success query
    res.redirect("http://localhost:5173/trainer/dashboard?google_connected=true");
  } catch (err) {
    console.error("Google Auth Callback Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Step 3: Check whether trainer has connected Google
exports.checkGoogleConnection = async (req, res) => {
  try {
    const user = await User.findByPk(req.user?.id, {
      attributes: ["googleAccessToken", "googleRefreshToken"],
    });

    const isConnected = !!(user.googleAccessToken && user.googleRefreshToken);
    res.json({ isConnected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Step 4: Disconnect trainer’s Google account
exports.disconnectGoogle = async (req, res) => {
  try {
    const user = await User.findByPk(req.user?.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.googleAccessToken) {
      try {
        await oauth2Client.revokeToken(user.googleAccessToken);
      } catch (err) {
        console.warn("⚠️ Token revoke failed:", err.message);
      }
    }

    await user.update({
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiry: null,
    });

    res.json({ message: "Google account disconnected successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
