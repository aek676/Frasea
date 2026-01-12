'use server';

import { dbConnect } from '@/lib/mongoose';
import { TranslationHistory } from '@/models/TranslationHistory';
import { User } from '@/models/User';
import { getAuthenticatedUser } from '@/utils/serverAuthUtils';

interface UserHistoryResponse {
  success: boolean;
  data: any[];
  error?: string;
}

interface SaveHistoryRequest {
  originaltext: string;
  translatedtext: string;
  sourcelanguage: string;
  targetlanguage: string;
}

// Private function - assumes authentication is already done by caller
async function addTranslationToHistory(
  userId: string,
  translationData: SaveHistoryRequest
): Promise<UserHistoryResponse> {
  try {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        data: [],
        error: 'User not found',
      };
    }

    // Create new translation document
    const translationEntry = new TranslationHistory({
      originaltext: translationData.originaltext,
      translatedtext: translationData.translatedtext,
      sourcelanguage: translationData.sourcelanguage,
      targetlanguage: translationData.targetlanguage,
    });

    user.translationHistory.push(translationEntry);
    await user.save();

    // Convert subdocuments to plain objects to avoid circular refs during serialization
    const plainHistory = user.translationHistory.map((h: any) => ({
      originaltext: h.originaltext,
      translatedtext: h.translatedtext,
      sourcelanguage: h.sourcelanguage,
      targetlanguage: h.targetlanguage,
      createdAt: h.createdAt,
      updatedAt: h.updatedAt,
    }));

    return {
      success: true,
      data: plainHistory,
    };
  } catch (error) {
    console.error('Error adding translation to history:', error);
    return {
      success: false,
      error: 'Failed to save translation',
      data: [],
    };
  }
}

export async function saveTranslationToHistory(
  translationData: SaveHistoryRequest
): Promise<UserHistoryResponse> {
  try {
    // Get authenticated user from server context - ONLY authentication needed
    const authResult = await getAuthenticatedUser();

    if ('error' in authResult) {
      return {
        success: false,
        error: 'Unauthorized',
        data: [],
      };
    }

    // Direct call to private function - no additional validation needed
    return await addTranslationToHistory(
      authResult.user.userId,
      translationData
    );
  } catch (error) {
    console.error('Error in saveTranslationToHistory:', error);
    return {
      success: false,
      error: 'Failed to save translation',
      data: [],
    };
  }
}

export async function getUserHistory(
  userId: string
): Promise<UserHistoryResponse> {
  try {
    // For getUserHistory, we need to validate that the requesting user
    // can only access their own history
    const authResult = await getAuthenticatedUser();

    if ('error' in authResult) {
      return {
        success: false,
        data: [],
        error: 'Unauthorized',
      };
    }

    // Validate that the authenticated user is requesting their own history
    if (authResult.user.userId !== userId) {
      return {
        success: false,
        data: [],
        error: 'Invalid user - can only access own history',
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
        error: 'User not found',
      };
    }

    const history = user.translationHistory || [];

    // Sort history by createdAt descending (most recent first)
    const sortedHistory = history.slice().sort((a: any, b: any) => {
      const ad = new Date(a.createdAt).getTime();
      const bd = new Date(b.createdAt).getTime();
      return bd - ad;
    });

    return {
      success: true,
      data: sortedHistory,
    };
  } catch (error) {
    console.error('Error fetching user history:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to fetch user history',
    };
  }
}
