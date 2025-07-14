const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // this is like a foregin key in SQL
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Please specify transaction type"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: [
        "food",
        "transport",
        "entertainment",
        "utilities",
        "salary",
        "freelance",
        "other",
      ],
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [0, "Amount must be positive"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: 200,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
// Index for efficient querying
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
module.exports = mongoose.model("Transaction", transactionSchema);
