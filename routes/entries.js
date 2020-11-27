const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const IncomeController = require('../controllers/income_C');
const ExpenseController = require('../controllers/expense_C');
const middlewares = require('../middlewares/middlewares');

//income
router.post('/main/:user_id/wallet/:wallet_id/:name/income', middlewares.isLoggedIn, middlewares.isAccountOwner, IncomeController.postIncome);

router.put('/main/:user_id/wallet/:wallet_id/:name/income/:income_id', middlewares.isLoggedIn, middlewares.isAccountOwner, IncomeController.updateIncome);

router.delete('/main/:user_id/wallet/:wallet_id/:name/income/:income_id', middlewares.isLoggedIn, middlewares.isAccountOwner, IncomeController.deleteIncome);

//expense
router.post('/main/:user_id/wallet/:wallet_id/:name/expense', middlewares.isLoggedIn, middlewares.isAccountOwner, ExpenseController.postExpense);

router.put('/main/:user_id/wallet/:wallet_id/:name/expense/:expense_id', middlewares.isLoggedIn, middlewares.isAccountOwner, ExpenseController.updateExpense);

router.delete('/main/:user_id/wallet/:wallet_id/:name/expense/:expense_id', middlewares.isLoggedIn, middlewares.isAccountOwner, ExpenseController.deleteExpense);

module.exports = router