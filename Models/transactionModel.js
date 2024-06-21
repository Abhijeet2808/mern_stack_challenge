const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  dateOfSale: Date,
  category: String,
  sold: Boolean,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
