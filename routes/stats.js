const express = require("express");
const router = express.Router();

const StatsController = require("../controllers/stats_C");
const historyController = require("../controllers/history_C");
const middlewares = require("../middlewares/middlewares");

router.get("/main/:user_id/wallet/:wallet_id/:name/stats", middlewares.isLoggedIn, middlewares.isAccountOwner, StatsController.getStats);

router.get("/main/:user_id/stats/:wallet_id", middlewares.isLoggedIn, middlewares.isAccountOwner, historyController.getPDF);

router.get("/data/:user_id/:wallet_id/incomes", StatsController.getIncomeData)

router.get("/data/:user_id/:wallet_id/expenses", StatsController.getExpenseData)

router.get("/data/:user_id/:wallet_id/expense_date", StatsController.getEntriesPerDate)

router.get("/data/:user_id/:wallet_id/income_date", StatsController.getIncomesPerDate)
//history
router.get("/main/:user_id/wallet/:wallet_id/:name/history", middlewares.isLoggedIn, middlewares.isAccountOwner, historyController.getHistory);

module.exports = router;
