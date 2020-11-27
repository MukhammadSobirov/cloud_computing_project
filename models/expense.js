let mongoose = require("mongoose");

let expenseSchema = new mongoose.Schema(
  {
    expenseCategory: { type: String, default: "other" },
    expenseAmount: Number,
    expenseDate: String,
    expenseNote: String,
  },
  { timestamps: Date.now }
);

module.exports = mongoose.model("Expense", expenseSchema);
