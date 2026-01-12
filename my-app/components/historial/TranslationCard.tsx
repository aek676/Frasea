import { CopyButton } from './CopyButton';

import type { TranslationHistoryDocument } from '@/models/TranslationHistory';

interface Translation {
  _id: string;
  originaltext: string;
  translatedtext: string;
  sourcelanguage: string;
  targetlanguage: string;
  createdAt: string;
  updatedAt: string;
}

interface TranslationCardProps {
  translation: Translation | TranslationHistoryDocument;
}

export function TranslationCard({ translation }: TranslationCardProps) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                {translation.sourcelanguage.toUpperCase()} → {translation.targetlanguage.toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(translation.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              📝 Original Text
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-gray-800 leading-relaxed">
                {translation.originaltext}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              🔄 Translation
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-gray-800 leading-relaxed">
                {translation.translatedtext}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <CopyButton 
            text={translation.originaltext} 
            label="Original text copied" 
          />
          <CopyButton 
            text={translation.translatedtext} 
            label="Translation copied" 
          />
        </div>
      </div>
    </div>
  );
}