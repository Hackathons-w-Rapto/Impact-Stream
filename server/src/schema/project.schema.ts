import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  deadline: Date;
  status: 'active' | 'upcoming' | 'completed';
  createdBy: string;
  stakingConditions?: string;
  rewardStructure?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true, min: 0 },
    currentAmount: { type: Number, default: 0, min: 0 },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'upcoming', 'completed'],
      default: 'upcoming',
    },
    createdBy: { type: String, required: true },
    stakingConditions: { type: String },
    rewardStructure: { type: String },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Virtual for progress percentage
ProjectSchema.virtual('progress').get(function (this: IProject) {
  return this.goalAmount > 0 ? (this.currentAmount / this.goalAmount) * 100 : 0;
});

// Index for faster queries
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ tags: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
