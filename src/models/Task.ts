import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  completed: boolean; 
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);