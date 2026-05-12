const { getUSDRate } = require("./exchangeRates");

// Convert any amount to USD for limit checking
const convertToUSD = async (amount, currency) => {
  const rate = await getUSDRate(currency);
  return amount * rate;
};

// Check if transaction exceeds single transaction limit
const checkTransactionLimit = async (amount, currency) => {
  const maxTransactionUSD = parseFloat(process.env.MAX_TRANSACTION_AMOUNT) || 10000;
  const amountInUSD = await convertToUSD(amount, currency);
  
  if (amountInUSD > maxTransactionUSD) {
    return {
      valid: false,
      message: `Transaction amount exceeds maximum limit of $${maxTransactionUSD} USD`,
    };
  }
  
  return { valid: true };
};

// Check and update daily transaction limit
const checkDailyLimit = async (user, amount, currency) => {
  const dailyLimitUSD = parseFloat(process.env.DAILY_TRANSACTION_LIMIT) || 50000;
  const amountInUSD = await convertToUSD(amount, currency);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Reset daily total if it's a new day
  if (!user.lastTransactionDate || user.lastTransactionDate < today) {
    user.dailyTransactionTotal = 0;
    user.lastTransactionDate = new Date();
  }
  
  const newTotal = user.dailyTransactionTotal + amountInUSD;
  
  if (newTotal > dailyLimitUSD) {
    return {
      valid: false,
      message: `Daily transaction limit of $${dailyLimitUSD} USD exceeded. Current total: $${user.dailyTransactionTotal.toFixed(2)} USD`,
    };
  }
  
  // Update daily total
  user.dailyTransactionTotal = newTotal;
  await user.save();
  
  return { valid: true };
};

module.exports = {
  checkTransactionLimit,
  checkDailyLimit,
  convertToUSD,
};
