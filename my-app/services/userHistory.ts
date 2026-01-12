"use server"

import { dbConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import type { TranslationHistoryDocument } from '@/models/TranslationHistory';

interface UserHistoryResponse {
  success: boolean;
  data: TranslationHistoryDocument[];
  error?: string;
}

interface SaveHistoryRequest {
  originaltext: string;
  translatedtext: string;
  sourcelanguage: string;
  targetlanguage: string;
}

export async function addTranslationToHistory(
  userId: string, 
  translationData: SaveHistoryRequest
): Promise<UserHistoryResponse> {
  try {
    if (!userId) {
      return {
        success: false,
        data: [],
        error: 'User ID is required'
      };
    }

    await dbConnect();
    
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        data: [],
        error: 'User not found'
      };
    }

    // Add new translation to history
    user.translationHistory.push(translationData as any);
    await user.save();

    return {
      success: true,
      data: user.translationHistory
    };

  } catch (error) {
    console.error('Error adding translation to history:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to add translation to history'
    };
  }
}

export async function getUserHistory(userId: string): Promise<UserHistoryResponse> {
  try {
    if (!userId) {
      return {
        success: false,
        data: [],
        error: 'User ID is required'
      };
    }

    await dbConnect();
    
    const user = await User.findById(userId)
      .select('translationHistory')
      .lean();

    if (!user) {
      return {
        success: false,
        data: [],
        error: 'User not found'
      };
    }

    const history = user.translationHistory || [];

    return {
      success: true,
      data: history
    };

  } catch (error) {
    console.error('Error fetching user history:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to fetch user history'
    };
  }
}