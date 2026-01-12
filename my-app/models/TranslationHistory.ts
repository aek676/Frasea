import { Schema, model, models } from "mongoose";
import type { Document, Model } from "mongoose";

export interface TranslationHistoryDocument extends Document {
  originaltext: string;
  translatedtext: string;
  sourcelanguage: string;
  targetlanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

export const translationHistorySchema = new Schema(
  {
    originaltext: {
      type: String,
      required: [true, "original text is required."],
    },
    translatedtext: {
      type: String,
      required: [true, "translated text is required."],
    },
    sourcelanguage: {
      type: String,
      required: [true, "source language is required."],
    },
    targetlanguage: {
      type: String,
      required: [true, "target language is required."],
    },
  },
  { timestamps: true },
);

export const TranslationHistory =
  (models.TranslationHistory as Model<TranslationHistoryDocument>) ||
  model<TranslationHistoryDocument>(
    "TranslationHistory",
    translationHistorySchema,
  );
