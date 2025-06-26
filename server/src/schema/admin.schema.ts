import mongoose, { Schema, Document } from 'mongoose';
import { randomBytes, scryptSync } from 'crypto';

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => boolean;
}

const AdminSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Password hashing middleware
AdminSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(this.password as string, salt, 64).toString('hex');
  
  this.salt = salt;
  this.password = hashedPassword;
  
  next();
});

// Method to compare password
AdminSchema.methods.comparePassword = function(candidatePassword: string): boolean {
  const hashedCandidate = scryptSync(candidatePassword, this.salt, 64).toString('hex');
  return this.password === hashedCandidate;
};

export default mongoose.model<IAdmin>('Admin', AdminSchema);
