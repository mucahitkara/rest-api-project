const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");
const { authMiddleware, verifiedMiddleware } = require("../middlewares/auth.middleware");

// Protected routes
router.get("/balance", authMiddleware, accountController.getBalance);
router.post("/transfer", authMiddleware, verifiedMiddleware, accountController.transfer);
router.post("/exchange", authMiddleware, verifiedMiddleware, accountController.exchange);
router.get("/lookup/:walletNumber", authMiddleware, accountController.lookupByNumber);

module.exports = router;
