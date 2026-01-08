import { Schema, model, models } from "mongoose";
import type { Document, Model } from "mongoose";
import { translationHistorySchema } from "./TranslationHistory";

export interface TranslationHistory {
  originaltext: string;
  translatedtext: string;
  sourcelanguage: string;
  targetlanguage: string;
}

export interface UserDocument extends Document {
  userName: string;
  email: string;
  passwordHash: string;
  translationHistory: TranslationHistory[];
}

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    translationHistory: [translationHistorySchema],
  },
  { timestamps: true },
);

export const User =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", userSchema);
