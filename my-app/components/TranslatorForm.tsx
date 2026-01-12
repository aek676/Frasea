'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ComboBox } from './ComboBox';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import Link from 'next/link';
import useSWR from "swr"
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import { useDebounce } from '@uidotdev/usehooks';
import PalabrasSeccion from './PalabrasSeccion';
import { useRouter } from 'next/navigation';
import LogoutForm from './logout/LogoutForm';
import { getCurrentUser } from '@/utils/clientAuth';

interface Language {
  code: string;
  name: string;
}

interface LanguagesResponse {
  languages: Language[];
}

export default function TranslatorForm() {
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const debounceTerm = useDebounce(sourceText, 600);
  const router = useRouter();
  // Estado para palabras individuales
  const [palabrasSource, setPalabrasSource] = useState<string[]>([]);
  // Ref para el temporizador de guardado en historial
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data, error, isLoading } = useSWR<LanguagesResponse>('/api/languages', fetcher);

  // Mostrar el mensaje de error cuando hay un problema con la carga de datos
  useEffect(() => {
    if (error) {
      toast.error("No available languages found");
    }
  }, [error]);

  // Use an empty array if data is not available yet
  const languages = data?.languages || [];

  // Function to save to history
  const saveToHistory = async (originalText: string, translatedText: string, sourceLang: string, targetLang: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.log('User not authenticated, will not save to history');
        toast.error('Please log in to save translations to history');
        return;
      }

      console.log('Sending translation to history:', {
        userId: user.userId,
        originalText,
        translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      });

      const response = await fetch('/api/user/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText,
          translatedText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Translation saved to history successfully:', result);
        toast.success('Translation saved to history');
      } else {
        const error = await response.json();
        console.error('Error saving to history:', error);
        toast.error(error.error || 'Error saving to history');
      }
    } catch (error) {
      console.error('Error saving to history:', error);
      toast.error('Error saving to history');
    }
  };

  // Function to swap languages
  const swapLanguages = () => {
    const tempSourceLanguage = sourceLanguage;
    const tempSourceText = sourceText;

    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempSourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(tempSourceText);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    toast.success('Session closed successfully');
    router.push('/login');
  };

  // Actualizamos las palabras cuando cambia el texto fuente
  useEffect(() => {
    if (sourceText.trim()) {
      setPalabrasSource(sourceText.split(' ').filter(word => word.trim() !== ''));
    } else {
      setPalabrasSource([]);
    }
  }, [sourceText]);

  useEffect(() => {
    const handleTranslate = async () => {
      // If there's no input text, clear the translation and exit
      if (!debounceTerm.trim()) {
        setTranslatedText("");
        setIsTranslating(false);
        return;
      }

      // If no languages are selected, don't proceed with translation
      if (!sourceLanguage || !targetLanguage) return;

      setIsTranslating(true);
      try {
        console.log(`Traduciendo de ${sourceLanguage} a ${targetLanguage}: "${debounceTerm}"`);

        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: debounceTerm,
            from: sourceLanguage,
            to: targetLanguage
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        setTranslatedText(result.translatedText);
        // Only show notification if there's translated text
        if (result.translatedText && result.translatedText.trim()) {
          toast.success("Translation completed");
        }
      } catch (error) {
        console.error("Translation error:", error);
        toast.error("Error translating text. Please try again.");
        setTranslatedText("Translation error");
      } finally {
        setIsTranslating(false);
      }
    };

    handleTranslate();
  }, [debounceTerm, sourceLanguage, targetLanguage]);

  // useEffect to automatically save to history after 3 seconds
  useEffect(() => {
    // Clear previous timer if it exists
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    // If there's translated text and selected languages, set up the timer
    if (translatedText &&
      translatedText !== "Translation error" &&
      sourceText.trim() &&
      sourceLanguage &&
      targetLanguage) {

      console.log('Configurando timer para guardar en historial en 3 segundos...', {
        sourceText: sourceText.substring(0, 50) + '...',
        translatedText: translatedText.substring(0, 50) + '...',
        sourceLanguage,
        targetLanguage
      });

      saveTimerRef.current = setTimeout(() => {
        console.log('Timer completed - Saving translation to history...');
        saveToHistory(sourceText, translatedText, sourceLanguage, targetLanguage);
      }, 3000); // 3 seconds
    } else {
      console.log('Timer not set. Conditions:', {
        hasTranslatedText: !!translatedText,
        isNotError: translatedText !== "Translation error",
        hasSourceText: !!sourceText.trim(),
        hasSourceLanguage: !!sourceLanguage,
        hasTargetLanguage: !!targetLanguage
      });
    }

    // Cleanup function to clear timer when component unmounts
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [translatedText, sourceText, sourceLanguage, targetLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Frasea Translator
          </h1>
          {/* Buttons */}
          <div className="absolute top-0 right-0 flex gap-2">
            <LogoutForm />
            <Link href="/historial">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
              >
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
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l4 2" />
                </svg>
                History
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Translation Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Language Selection */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-sm">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  🌍 Source Language
                </label>
                <ComboBox
                  items={languages}
                  placeholder={isLoading ? "Loading..." : "Select a language"}
                  searchPlaceholder="Search language..."
                  emptyMessage={isLoading ? "Loading..." : "Not found"}
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  className="w-full"
                />
              </div>

              {/* Swap Button */}
              <div className="mx-6">
                <button
                  onClick={swapLanguages}
                  disabled={!sourceLanguage || !targetLanguage}
                  className="group p-3 rounded-full bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Swap languages"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600 group-hover:rotate-180 transition-transform duration-300"
                  >
                    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 max-w-sm">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  🎯 Target Language
                </label>
                <ComboBox
                  items={languages}
                  placeholder={isLoading ? "Loading..." : "Select language"}
                  searchPlaceholder="Search language..."
                  emptyMessage={isLoading ? "Loading..." : "Not found"}
                  value={targetLanguage}
                  onChange={setTargetLanguage}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid md:grid-cols-2 gap-0">
            {/* Source Text */}
            <div className="p-6 border-r border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  ✏️ Original Text
                </label>
                {sourceText.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {sourceText.length} characters
                  </span>
                )}
              </div>
              <Textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Type or paste here the text you want to translate..."
                className="min-h-[200px] border-0 focus:ring-2 focus:ring-blue-500 resize-none text-base leading-relaxed"
              />
            </div>

            {/* Translated Text */}
            <div className="p-6 bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  🔄 Translation
                  {isTranslating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  )}
                </label>
                {translatedText.length > 0 && (
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {translatedText.length} characters
                  </span>
                )}
              </div>
              <Textarea
                value={translatedText}
                readOnly
                placeholder={isTranslating ? "Translating..." : "The translation will appear here"}
                className="min-h-[200px] border-0 bg-transparent resize-none text-base leading-relaxed cursor-default"
              />
            </div>
          </div>

          {/* Status Bar */}
          {(sourceText.trim() || translatedText.trim()) && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  {sourceLanguage && targetLanguage && (
                    <span>
                      {languages.find((l: Language) => l.code === sourceLanguage)?.name || sourceLanguage} → {languages.find((l: Language) => l.code === targetLanguage)?.name || targetLanguage}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Temporary manual save button for testing */}
                  {translatedText && translatedText !== "Translation error" && (
                    <Button
                      onClick={() => saveToHistory(sourceText, translatedText, sourceLanguage, targetLanguage)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      💾 Save to History
                    </Button>
                  )}
                  {isTranslating ? (
                    <span className="text-blue-600">Translating...</span>
                  ) : translatedText && (
                    <span className="text-green-600">✓ Translated</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Word Analysis Section */}
        {sourceText.trim() && sourceLanguage && targetLanguage && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <PalabrasSeccion
              palabrasSource={palabrasSource}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
