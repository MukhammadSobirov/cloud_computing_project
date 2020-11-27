const User = require("../models/user");
const Wallet = require("../models/wallet");
const Income = require("../models/income");
const Expense = require("../models/expense");
const Notes = require("../models/notes");

exports.getMain = async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    const user = await User.findById(user_id).populate("wallets");
    const wallet = await Wallet.find({ user: user_id }).populate(
      "incomes expenses"
    );
    res.render("main", {
      path: `/main/${user_id}`,
      pageTitle: "Main",
      wallet: wallet,
      user_id: user_id,
      // errorMessage: message,
      validationErrors: [],
      email: user.email,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postWallet = async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    const user = await User.findById(user_id);
    const wallet = await Wallet.create(req.body.wallet);
    await user.wallets.push(wallet);
    wallet.user = user;
    await wallet.save();
    await user.save();
    res.redirect("/main/" + user_id);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

//update
exports.getEdit = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  try {
    const user = await User.findById(user_id);
    const wallet = await Wallet.findById(req.params.wallet_id);
    res.render("edit_wallet", {
      wallet: wallet,
      pageTitle: "Update" + " " + wallet.name,
      path: `/main/${user_id}/wallet/${wallet_id}`,
      user_id: user._id,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.updateWallet = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findByIdAndUpdate(wallet_id, req.body.wallet);
    res.redirect("/main/" + user_id);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

//show
exports.showWallet = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  const wallet_name = req.params.name;
  try {
    const income = await Income.find();
    const expense = await Expense.find();
    const user = await User.findById(user_id);
    const wallet = await Wallet.findById(wallet_id).populate(
      "incomes expenses"
    );
    res.render("wallet", {
      pageTitle: wallet.name,
      path: `/main/${user_id}/wallet/${wallet_id}/${wallet.name}`,
      wallet: wallet,
      user_id: user._id,
      wallet_name: wallet_name,
      income: income,
      expense: expense,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

//destroy
exports.deleteWallet = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findByIdAndRemove(wallet_id);
    res.redirect("/main/" + user_id);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};




