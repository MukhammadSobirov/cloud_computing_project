const fs = require("fs");
const path = require("path");

const PDFdoc = require("pdfkit");

const Wallet = require("../models/wallet");

exports.getPDF = async (req, res, next) => {
  const wallet_id = req.params.wallet_id;
  try {
    const wallet = await Wallet.findById(wallet_id).populate(
      "incomes expenses"
    );
    const currency = wallet.currency;
    const reportName = "report-" + wallet.name + ".pdf";
    const reportPath = path.join("data", "reports", reportName);
    const doc = new PDFdoc();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + reportName + '"'
    );
    doc.pipe(fs.createWriteStream(reportPath));
    doc.pipe(res);

    doc.fontSize(14).text(`General Report`, 50, 50);
    doc.moveDown();
    doc.text(`Wallet name: ${wallet.name}`);
    doc.moveDown();
    doc.text(`Currency: ${wallet.currency}`);
    doc.moveDown();
    doc.fontSize(12).text(`Access date: ${Date()}`);
    doc.moveDown();
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
    doc.text(
      "_____________________________________________________________________"
    );
    doc.moveDown();
    doc.fontSize(13).text(`Current Balance: ${total - total_exp} ${currency}`, {
      underline: true,
    });
    doc.moveDown();
    doc.fontSize(13).text("Incomes", { underline: true });
    doc.moveDown();
    doc
      .fontSize(11)
      .text(
        `Total income for whole period: ${total} ${currency} (from ${
          income_dates[income_dates.length - 1]
        } to ${income_dates[0]})`
      );
    doc.moveDown();
    doc
      .fontSize(11)
      .text(
        `Average income for whole period: ${
          total / wallet.incomes.length
        } ${currency}`
      );
    doc.moveDown();
    doc.fontSize(13).text("Expenses", { underline: true });
    doc.moveDown();
    doc
      .fontSize(11)
      .text(
        `Total expense for whole period: ${total_exp} ${currency} (from ${
          exp_dates[exp_dates.length - 1]
        } to ${exp_dates[0]})`
      );
    doc.moveDown();
    doc
      .fontSize(11)
      .text(
        `Average expense for whole period: ${
          total_exp / wallet.expenses.length
        } ${currency}`
      );
    doc.moveDown();
    doc
      .fontSize(14)
      .text("_______________________Income history_______________________");
    wallet.incomes.forEach((i) => {
      doc.moveDown();
      doc.text("_______________________________________________");
      doc.moveDown();
      doc.fontSize(11).text(`Date:      ........... ${i.IncomeDate}`);
      doc
        .fontSize(11)
        .text(`Amount:    ......... ${i.IncomeAmount} ${currency}`);
      doc.fontSize(11).text(`Category:  ....... ${i.incomeCategory}`);
      doc.fontSize(11).text(`Note:      ........... ${i.incomeNote}`);
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text("_______________________Expense history_______________________");
    wallet.expenses.forEach((e) => {
      doc.moveDown();
      doc.text("_______________________________________________");
      doc.moveDown();
      doc
        .fontSize(11)
        .text(`Date:      ........... ${e.expenseDate} ${currency}`);
      doc.fontSize(11).text(`Amount:    ......... ${e.expenseAmount}`);
      doc.fontSize(11).text(`Category:  ....... ${e.expenseCategory}`);
      doc.fontSize(11).text(`Note:      ........... ${e.expenseNote}`);
    });

    doc.end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

//history
exports.getHistory = async (req, res, next) => {
  const wallet_id = req.params.wallet_id;
  const user_id = req.params.user_id;
  const name = req.params.name;
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
    res.render("history", {
      pageTitle: "History",
      wallet_id: wallet_id,
      wallet_name: name,
      wallet: wallet,
      expenses: wallet.expenses,
      incomes: wallet.incomes,
      user_id: user_id,
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
