const { Account } = require("../models");

/**
 * Generates a random 16-digit numeric string.
 */
const generate16DigitNumber = () => {
  let number = "";
  for (let i = 0; i < 16; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
};

/**
 * Generates a unique 16-digit wallet number for a specific currency.
 * Ensures uniqueness by checking against existing accounts.
 */
const generateUniqueWalletNumber = async (currency) => {
  let number;
  let exists = true;
  
  while (exists) {
    number = generate16DigitNumber();
    const existing = await Account.findOne({ [`walletNumbers.${currency}`]: number });
    if (!existing) {
      exists = false;
    }
  }
  
  return number;
};

/**
 * Generates all 10 wallet numbers for an account.
 */
const generateAllWalletNumbers = async () => {
  const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "UZS", "CAD", "AUD", "CHF", "CNY"];
  const walletNumbers = {};
  
  for (const currency of currencies) {
    walletNumbers[currency] = await generateUniqueWalletNumber(currency);
  }
  
  return walletNumbers;
};

module.exports = {
  generate16DigitNumber,
  generateUniqueWalletNumber,
  generateAllWalletNumbers
};
