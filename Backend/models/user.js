import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password:        { type: String, required: true, select: false },
    name:            { type: String, required: true, trim: true },
    profilePicture:  { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin:       { type: Date, default: null },
    is2FAEnabled:    { type: Boolean, default: false },
    twoFAOtp:        { type: String, select: false },
    twoFAOtpExpires: { type: Date, select: false },
    accountType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
    },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "member"],
      default: "member",
    },
  },
  { timestamps: true }
);

// ── Şifre karşılaştır ────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;