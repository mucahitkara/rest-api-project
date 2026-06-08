const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Protected routes
// NOTE: email-verification gate (verifiedMiddleware) temporarily removed from
// transfer/exchange so they work without SMTP configured. Re-add once email
// verification is wired up.
router.get("/balance", authMiddleware, accountController.getBalance);
router.post("/transfer", authMiddleware, accountController.transfer);
router.post("/exchange", authMiddleware, accountController.exchange);
router.get("/lookup/:walletNumber", authMiddleware, accountController.lookupByNumber);

module.exports = router;
