const mongoose = require("mongoose");
const { Account, User } = require("../models");
const Transaction = require("../models/transactionModel");
const { transferSchema, exchangeSchema } = require("../validators/account.validator");
const { checkTransactionLimit, checkDailyLimit } = require("../utils/transactionLimits");
const { generateAllWalletNumbers } = require("../utils/walletGenerator");

exports.getBalance = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account) return res.status(404).json({ message: "Account not found" });

    // Auto-generate numbers for existing accounts that don't have them
    if (!account.walletNumbers || Object.keys(account.walletNumbers || {}).length === 0) {
      account.walletNumbers = await generateAllWalletNumbers();
      await account.save();
    }

    res.status(200).json({ 
      balances: Object.fromEntries(
        Object.entries(account.balances.toObject()).map(([k, v]) => [k, v ? v.toString() : "0"])
      ), 
      walletNumbers: account.walletNumbers 
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch balance" });
  }
};

exports.transfer = async (req, res) => {
  const { to, walletNumber, currency, amount } = req.body;
  
  // Custom validation since either 'to' or 'walletNumber' can be present
  if (!to && !walletNumber) {
    return res.status(400).json({ message: "Recipient (userId or walletNumber) is required" });
  }
  
  const { error } = transferSchema.validate({ to, currency, amount }, { allowUnknown: true });
  if (error && !walletNumber) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check transaction limit
    const limitCheck = checkTransactionLimit(amount, currency);
    if (!limitCheck.valid) {
      await session.abortTransaction();
      return res.status(400).json({ message: limitCheck.message });
    }
    
    // Get sender user for daily limit check
    const senderUser = await User.findById(req.userId).session(session);
    if (!senderUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check daily limit
    const dailyCheck = await checkDailyLimit(senderUser, amount, currency);
    if (!dailyCheck.valid) {
      await session.abortTransaction();
      return res.status(400).json({ message: dailyCheck.message });
    }
    
    const sender = await Account.findOne({ userId: req.userId }).session(session);
    const senderBalance = sender ? parseFloat(sender.balances[currency].toString()) : 0;

    if (!sender || senderBalance < amount) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Insufficient funds or account not found" });
    }

    let receiverId = to;
    if (walletNumber) {
      const walletAccount = await Account.findOne({ [`walletNumbers.${currency}`]: walletNumber }).session(session);
      if (!walletAccount) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Wallet number not found for this currency" });
      }
      receiverId = walletAccount.userId;
    }

    const receiver = await Account.findOne({ userId: receiverId }).session(session);
    const receiverUser = await User.findById(receiverId).session(session);
    if (!receiver || !receiverUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Receiver not found" });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { [`balances.${currency}`]: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: receiverId },
      { $inc: { [`balances.${currency}`]: amount } }
    ).session(session);

    await Transaction.create(
      [
        {
          userId: req.userId,
          type: "send",
          amount,
          currency,
          targetId: receiverId,
          targetName: `${receiverUser.firstName} ${receiverUser.lastName}`,
          date: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Transfer failed" });
  } finally {
    session.endSession();
  }
};

const { calculateExchange } = require("../utils/exchangeRates");

exports.exchange = async (req, res) => {
  const { fromCurrency, toCurrency, fromAmount } = req.body;
  // Validate input - Note: we don't trust toAmount from body anymore
  const { error } = exchangeSchema.validate({ fromCurrency, toCurrency, fromAmount });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Calculate trusted amount on server
  let toAmount;
  try {
    toAmount = calculateExchange(fromCurrency, toCurrency, fromAmount);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check transaction limit
    const limitCheck = checkTransactionLimit(fromAmount, fromCurrency);
    if (!limitCheck.valid) {
      await session.abortTransaction();
      return res.status(400).json({ message: limitCheck.message });
    }
    
    // Get user for daily limit check
    const user = await User.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check daily limit
    const dailyCheck = await checkDailyLimit(user, fromAmount, fromCurrency);
    if (!dailyCheck.valid) {
      await session.abortTransaction();
      return res.status(400).json({ message: dailyCheck.message });
    }
    
    const account = await Account.findOne({ userId: req.userId }).session(session);
    const fromBalance = account ? parseFloat(account.balances[fromCurrency].toString()) : 0;

    if (!account || fromBalance < fromAmount) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Insufficient funds or account not found" });
    }

    await Account.updateOne(
      { userId: req.userId },
      {
        $inc: {
          [`balances.${fromCurrency}`]: -fromAmount,
          [`balances.${toCurrency}`]: toAmount,
        },
      }
    ).session(session);

    await Transaction.create(
      [
        {
          userId: req.userId,
          type: "exchange",
          amount: fromAmount,
          currency: fromCurrency,
          targetName: `${fromCurrency} → ${toCurrency}`,
          date: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({ message: "Exchange successful" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Exchange failed" });
  } finally {
    session.endSession();
  }
};

exports.lookupByNumber = async (req, res) => {
  try {
    const { walletNumber } = req.params;
    
    // Find account by any of the currency wallet numbers
    const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "UZS", "CAD", "AUD", "CHF", "CNY"];
    const query = { $or: currencies.map(c => ({ [`walletNumbers.${c}`]: walletNumber })) };
    
    const account = await Account.findOne(query);
    if (!account) return res.status(404).json({ message: "Wallet number not found" });

    // Check which currency this number belongs to
    const currency = currencies.find(c => account.walletNumbers[c] === walletNumber);

    const user = await User.findById(account.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const maskName = (name) => name.charAt(0) + "*".repeat(name.length - 1);

    res.status(200).json({
      firstName: maskName(user.firstName),
      lastName: maskName(user.lastName),
      currency
    });
  } catch (err) {
    res.status(500).json({ message: "Lookup failed" });
  }
};
