let mongoose = require("mongoose");

let walletSchema = new mongoose.Schema({
  currency: String,
  name: String,
  incomes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Income"
    },
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense"
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});


module.exports = mongoose.model("Wallet", walletSchema);
