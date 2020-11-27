const fs = require("fs");
const path = require("path");

const PDFdoc = require("pdfkit");

const Wallet = require("../models/wallet");
const User = require("../models/user");
const Income = require("../models/income");
const Expense = require("../models/expense");
const Notes = require("../models/notes");

exports.getStats = async (req, res, next) => {
  const wallet_id = req.params.wallet_id;
  const name = req.params.name;
  const user_id = req.params.user_id;
  try {
    const wallet = await Wallet.findById(wallet_id).populate(
      "incomes expenses"
    );
    let total = 0;
    const income_dates = [];
    wallet.incomes.forEach((inc) => {
      total += inc.IncomeAmount;
      income_dates.push(inc.IncomeDate);
    });
    let total_exp = 0;
    const exp_dates = [];
    wallet.expenses.forEach((exp) => {
      total_exp += exp.expenseAmount;
      exp_dates.push(exp.expenseDate);
    });
    res.render("stats", {
      pageTitle: "Stats",
      wallet_id: wallet_id,
      wallet_name: wallet.name,
      user_id: user_id,
      wallet: wallet,
      income_path: `/data/${user_id}/${wallet_id}`,
      expenses: wallet.expenses,
      incomes: wallet.incomes,
      total_exp: total_exp,
      total: total,
      average_income: Math.round(total / wallet.incomes.length),
      average_expense: Math.round(total_exp / wallet.expenses.length),
      currency: wallet.currency,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

//  /data/:user_id/:wallet_id/income
exports.getIncomeData = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findById(wallet_id).populate("incomes");
    if (!wallet) {
      const error = new Error("No such wallet");
      error.statusCode = 404;
      throw error;
    }

    const incomes = wallet.incomes;
    let arr1 = [];
    let unsorted = [];
    for (let j = 0; j < incomes.length; j++) {
      let arr0 = [incomes[j].incomeCategory, incomes[j].IncomeAmount];
      unsorted.push(arr0);
    }

    for (let i = 0; i < unsorted.length; i++) {
      let hold = [unsorted[i][0], unsorted[i][1]];
      const filtered = unsorted.filter((el) => hold[0] === el[0]);

      const reduced = filtered
        .map((x) => {
          return x[1];
        })
        .reduce((a, b) => a + b);
      let sorted = [filtered[0][0], reduced];
      let mixed = sorted.map((z) => {
        arr1.push(z);
      });
    }

    const ready = [];
    for (let y = 0; y < arr1.length; y++) {
      let arr_1 = [arr1[y], arr1[++y]];
      ready.push(arr_1);
    }

    const obj = Object.fromEntries(ready);
    const income_category = [];
    for (let [category, value] of Object.entries(obj)) {
      let transform = { category, value };
      income_category.push(transform);
    }

    res.status(200).json({
      message: "Data found",
      income_category: income_category,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getExpenseData = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findById(wallet_id).populate("expenses");
    if (!wallet) {
      const error = new Error("No such wallet");
      error.statusCode = 404;
      throw error;
    }

    const expenses = wallet.expenses;
    let arr1 = [];
    let unsorted = [];
    for (let j = 0; j < expenses.length; j++) {
      let arr0 = [expenses[j].expenseCategory, expenses[j].expenseAmount];
      unsorted.push(arr0);
    }

    for (let i = 0; i < unsorted.length; i++) {
      let hold = [unsorted[i][0], unsorted[i][1]];
      const filtered = unsorted.filter((el) => hold[0] === el[0]);

      const reduced = filtered
        .map((x) => {
          return x[1];
        })
        .reduce((a, b) => a + b);
      let sorted = [filtered[0][0], reduced];
      let mixed = sorted.map((z) => {
        arr1.push(z);
      });
    }

    const ready = [];
    for (let y = 0; y < arr1.length; y++) {
      let arr_1 = [arr1[y], arr1[++y]];
      ready.push(arr_1);
    }

    const obj = Object.fromEntries(ready);
    const expense_category = [];
    for (let [category, value] of Object.entries(obj)) {
      let transform = { category, value };
      expense_category.push(transform);
    }

    res.status(200).json({
      message: "Data found",
      expense_category: expense_category,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getEntriesPerDate = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findById(wallet_id).populate("expenses");
    if (!wallet) {
      const error = new Error("No such wallet");
      error.statusCode = 404;
      throw error;
    }

    const expenses = wallet.expenses;
    let arr1 = [];
    let unsorted = [];
    for (let j = 0; j < expenses.length; j++) {
      let arr0 = [expenses[j].expenseDate, expenses[j].expenseAmount];
      unsorted.push(arr0);
    }

    for (let i = 0; i < unsorted.length; i++) {
      let hold = [unsorted[i][0], unsorted[i][1]];
      const filtered = unsorted.filter((el) => hold[0] === el[0]);

      const reduced = filtered
        .map((x) => {
          return x[1];
        })
        .reduce((a, b) => a + b);
      let sorted = [filtered[0][0], reduced];
      let mixed = sorted.map((z) => {
        arr1.push(z);
      });
    }

    const ready = [];
    for (let y = 0; y < arr1.length; y++) {
      let arr_1 = [arr1[y], arr1[++y]];
      ready.push(arr_1);
    }

    const obj = Object.fromEntries(ready);
    const expense_date = [];
    for (let [date, value] of Object.entries(obj)) {
      let transform = { date, value };
      expense_date.push(transform);
    }

    res.status(200).json({
      message: "Data found",
      expense_date: expense_date,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getIncomesPerDate = async (req, res, next) => {
  const user_id = req.params.user_id;
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findById(wallet_id).populate("incomes");
    if (!wallet) {
      const error = new Error("No such wallet");
      error.statusCode = 404;
      throw error;
    }

    const incomes = wallet.incomes;
    let arr1 = [];
    let unsorted = [];
    for (let j = 0; j < incomes.length; j++) {
      let arr0 = [incomes[j].IncomeDate, incomes[j].IncomeAmount];
      unsorted.push(arr0);
    }

    for (let i = 0; i < unsorted.length; i++) {
      let hold = [unsorted[i][0], unsorted[i][1]];
      const filtered = unsorted.filter((el) => hold[0] === el[0]);

      const reduced = filtered
        .map((x) => {
          return x[1];
        })
        .reduce((a, b) => a + b);
      let sorted = [filtered[0][0], reduced];
      let mixed = sorted.map((z) => {
        arr1.push(z);
      });
    }

    const ready = [];
    for (let y = 0; y < arr1.length; y++) {
      let arr_1 = [arr1[y], arr1[++y]];
      ready.push(arr_1);
    }

    const obj = Object.fromEntries(ready);
    const income_date = [];
    for (let [date, value] of Object.entries(obj)) {
      let transform = { date, value };
      income_date.push(transform);
    }

    res.status(200).json({
      message: "Data found",
      income_date: income_date,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
