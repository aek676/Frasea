"use client";

import { fetcher } from "@/lib/fetcher";
import React from "react";
import useSWR from "swr";

interface Example {
  source: string;
  target: string;
}

interface TranslationItem {
  word: string;
  examples: Example[];
}

interface PalabraDetalleProps {
  palabra: string;
  idiomaOrigen: string;
  idiomaDestino: string;
  onClose: () => void;
}

const PalabraDetalle: React.FC<PalabraDetalleProps> = ({
  palabra,
  idiomaOrigen,
  idiomaDestino,
  onClose,
}) => {
  const externalUrl = `/scrapDictionary/${encodeURIComponent(
    idiomaOrigen.split('-')[0],
  )}/${encodeURIComponent(idiomaDestino.split('-')[0])}/${encodeURIComponent(palabra)}`;

  console.log("PalabraDetalle using API:", externalUrl);

  const { data, error, isLoading } = useSWR<TranslationItem[]>(
    externalUrl,
    fetcher,
  );

  if (!data) {
    console.log("Loading data...");
  } else {
    console.log("Data loaded:", data);
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Word: <span className="font-bold">{palabra}</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-700">
            Translating from <span className="font-medium">{idiomaOrigen}</span>{" "}
            to <span className="font-medium">{idiomaDestino}</span>
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading information...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-600">Error loading dictionary information</p>
          </div>
        )}

        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((item: TranslationItem, index: number) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-blue-700">
                    {item.word}
                  </span>
                </div>

                {item.examples.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Examples:
                    </h5>
                    <div className="space-y-2">
                      {item.examples.map(
                        (example: Example, exampleIndex: number) => (
                          <div
                            key={exampleIndex}
                            className="bg-gray-50 p-3 rounded text-sm"
                          >
                            <p className="text-gray-800 mb-1">
                              <span className="font-medium">
                                {idiomaOrigen}:
                              </span>{" "}
                              {example.source}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">
                                {idiomaDestino}:
                              </span>{" "}
                              {example.target}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isLoading &&
          !error && (
            <div className="text-center py-4">
              <p className="text-gray-600 italic">
                No information found for this word.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PalabraDetalle;
