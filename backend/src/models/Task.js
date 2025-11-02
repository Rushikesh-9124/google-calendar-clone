import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date, required: true },
  category: {
    type: String,
    enum: ["My Tasks", "Work", "Personal"],
    default: "My Tasks"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TaskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

TaskSchema.index({ dueDate: 1 });

export default mongoose.model("Task", TaskSchema);
