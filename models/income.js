let mongoose = require("mongoose");

let incomeSchema = new mongoose.Schema(
  {
    incomeCategory: { type: String, default: "other" },
    IncomeAmount: Number,
    IncomeDate: String,
    incomeNote: String,
  },
  { timestamps: Date.now }
);

module.exports = mongoose.model("Income", incomeSchema);
