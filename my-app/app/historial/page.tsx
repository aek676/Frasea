import { getServerAuth } from "@/utils/serverAuth";
import { getUserHistory } from "@/services/userHistory";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HistorySkeleton } from "@/components/historial/HistorySkeleton";
import { TranslationCard } from "@/components/historial/TranslationCard";
import { LogoutButton } from "@/components/historial/LogoutButton";

interface Translation {
  _id: string;
  originaltext: string;
  translatedtext: string;
  sourcelanguage: string;
  targetlanguage: string;
  createAt: string;
  updatedAt: string;
}

export default async function HistorialPage() {
  const { userId } = await getServerAuth();

  const { success, data: history, error } = await getUserHistory(userId);

  if (!success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Error Loading History
            </h2>
            <p className="text-gray-500 mb-6">
              {error || "Failed to load translation history"}
            </p>
            <Link href="/translator">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Go to Translator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Translation History
            </h1>
            <p className="text-gray-600 mt-2">
              Review all your previous translations
            </p>
          </div>

          <div className="flex gap-3">
            <LogoutButton />
            <Link href="/translator">
              <Button variant="outline" className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Translator
              </Button>
            </Link>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No translations in history
            </h2>
            <p className="text-gray-500 mb-6">
              Start translating to see your history here
            </p>
            <Link href="/translator">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Go to Translator
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((translation) => (
              <TranslationCard
                key={String(translation._id)}
                translation={translation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
