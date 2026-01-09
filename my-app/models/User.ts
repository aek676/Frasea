import type { Document, Model } from 'mongoose';
import { Schema, model, models } from 'mongoose';
import {
  TranslationHistoryDocument,
  translationHistorySchema,
} from './TranslationHistory';

export interface UserDocument extends Document {
  username: string;
  passwordHash: string;
  translationHistory: TranslationHistoryDocument[];
}

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    translationHistory: [translationHistorySchema],
  },
  { timestamps: true }
);

export const User =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>('User', userSchema);
