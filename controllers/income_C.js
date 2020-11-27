const Wallet = require('../models/wallet');
const Income = require("../models/income");

exports.postIncome = async (req, res, next) => {
    const wallet_id = req.params.wallet_id;
    const user_id = req.params.user_id;
    try {
        const wallet = await Wallet.findById(wallet_id);
        const income = await Income.create(req.body.income);
        await wallet.incomes.push(income);
        await wallet.save();
        res.redirect(`/main/${user_id}/wallet/${wallet_id}/${wallet.name}`)
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.updateIncome = async (req, res, next) => {
    const wallet_id = req.params.wallet_id;
    const income_id = req.params.income_id;
    const user_id = req.params.user_id;
    try {
        const income = await Income.findByIdAndUpdate(income_id, req.body.income);
        res.redirect(`/main/${user_id}/wallet/${wallet_id}/${wallet.name}`);
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.deleteIncome = async (req, res, next) => {
    const user_id = req.params.user_id;
    const wallet_id = req.params.wallet_id;
    const wallet_name = req.params.wallet_name;
    try {
        
        const income = await Income.findByIdAndRemove(req.params.income_id);
        res.redirect(`/main/${user_id}/wallet/${wallet_id}/${wallet_name}`);
    } catch (err) {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    }
}