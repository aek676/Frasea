'use client'

import React, { useState } from 'react'

export default function Page() {
  const [data, setData] = useState('');

  const handleGetRoot = async () => {
    try {
      // Llamamos a /scrapDictionary que redirecciona a la raíz "/" de Rust
      const res = await fetch('/scrapDictionary');

      // Como Rust devuelve un &'static str (texto plano), usamos .text()
      const text = await res.text();

      setData(text);
      console.log("Respuesta de Rust:", text);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-10">
      <button
        onClick={handleGetRoot}
        className="bg-black text-white p-2 rounded"
      >
        Llamar a Rust (GET)
      </button>

      {data && <p className="mt-4 text-xl">Respuesta: {data}</p>}
    </div>
  );
}
