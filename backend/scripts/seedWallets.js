require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { Account } = require("../models");
const { generateAllWalletNumbers } = require("../utils/walletGenerator");

const seedWalletNumbers = async () => {
  try {
    await connectDB();
    console.log("🔍 Checking accounts for missing wallet numbers...");

    const accounts = await Account.find({
      $or: [
        { walletNumbers: { $exists: false } },
        { walletNumbers: {} },
        { "walletNumbers.USD": { $exists: false } }
      ]
    });

    if (accounts.length === 0) {
      console.log("✅ All accounts already have wallet numbers. No action needed.");
      process.exit(0);
    }

    console.log(`🚀 Found ${accounts.length} accounts to update. Starting generation...`);

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      process.stdout.write(`Processing [${i + 1}/${accounts.length}]... `);
      
      const numbers = await generateAllWalletNumbers();
      account.walletNumbers = numbers;
      await account.save();
      
      console.log("Done ✅");
    }

    console.log("\n✨ Successfully seeded wallet numbers for all existing accounts!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedWalletNumbers();
