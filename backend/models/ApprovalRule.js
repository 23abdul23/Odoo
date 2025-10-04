import mongoose from "mongoose"

const approvalRuleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Sequential", "Percentage", "SpecificApprover", "Hybrid"],
      required: true,
    },
    // For Sequential and Hybrid types
    sequence: [
      {
        level: Number,
        role: {
          type: String,
          enum: ["Manager", "Finance", "Director", "Admin"],
        },
        approverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    // For Percentage type
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    // For SpecificApprover type
    specificApproverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Conditions
    minAmount: {
      type: Number,
      default: 0,
    },
    maxAmount: {
      type: Number,
      default: null,
    },
    categories: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("ApprovalRule", approvalRuleSchema)
