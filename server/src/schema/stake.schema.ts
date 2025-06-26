import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from './project.schema';

export interface IStake extends Document {
  projectId: IProject['_id'];
  amount: number;
  address: string; // User wallet address
  intent: string; // Umi intent hash
  status: 'pending' | 'processed' | 'claimed'; 
  timestamp: Date;
  txHash?: string; // Transaction hash once processed
}

const StakeSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    address: {
      type: String,
      required: true,
      index: true,
    },
    intent: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'claimed'],
      default: 'pending',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    txHash: {
      type: String,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
StakeSchema.index({ projectId: 1 });
StakeSchema.index({ address: 1, projectId: 1 });
StakeSchema.index({ status: 1 });

export default mongoose.model<IStake>('Stake', StakeSchema); 