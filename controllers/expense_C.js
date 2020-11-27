const Wallet = require('../models/wallet');
const Expense = require('../models/expense');

exports.postExpense = async (req, res, next) => {
    const wallet_id = req.params.wallet_id;
    const user_id = req.params.user_id;
    try {
        const wallet = await Wallet.findById(wallet_id);
        const expense = await Expense.create(req.body.expense);
        await wallet.expenses.push(expense);
        await wallet.save();
        console.log(expense)
        res.redirect(`/main/${user_id}/wallet/${wallet_id}/${wallet.name}`)
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.updateExpense = async (req, res, next) => {
    const wallet_id = req.params.wallet_id;
    const expense_id = req.params.expense_id;
    const user_id = req.params.user_id;
    try {
        const expense = await Expense.findByIdAndUpdate(expense_id, req.body.income);
        res.redirect(`/main/${user_id}/wallet/${wallet_id}/${wallet.name}`);
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.deleteExpense = async (req, res, next) => {
    const user_id = req.params.user_id;
    const wallet_id = req.params.wallet_id
    const wallet_name = req.params.wallet_name;
    try {
        const expense = await Expense.findByIdAndRemove(req.params.expense_id);
        res.redirect(`/main/${user_id}/wallet/${wallet_id}/${wallet_name}`);
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    }
}