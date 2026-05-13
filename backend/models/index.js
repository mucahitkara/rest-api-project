const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  refreshTokens: [{ type: String }],
  lastTransactionDate: { type: Date },
  dailyTransactionTotal: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

// Account Schema with balances per currency
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balances: {
    USD: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    EUR: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    GBP: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    INR: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    JPY: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    UZS: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    CAD: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    AUD: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    CHF: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    CNY: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  },
  walletNumbers: {
    USD: { type: String, unique: true, sparse: true },
    EUR: { type: String, unique: true, sparse: true },
    GBP: { type: String, unique: true, sparse: true },
    INR: { type: String, unique: true, sparse: true },
    JPY: { type: String, unique: true, sparse: true },
    UZS: { type: String, unique: true, sparse: true },
    CAD: { type: String, unique: true, sparse: true },
    AUD: { type: String, unique: true, sparse: true },
    CHF: { type: String, unique: true, sparse: true },
    CNY: { type: String, unique: true, sparse: true },
  },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = { User, Account };
