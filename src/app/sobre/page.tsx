import React from "react";

export default function SobrePage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Sobre</h1>
      <p className="text-sm text-neutral-700">Triagem preventiva de bebidas destiladas. Não é exame confirmatório.</p>
      <button className="bg-black text-white rounded-lg py-3 px-4">Começar medição</button>
    </div>
  );
}