import React from "react";

export default function MetodologiaPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Metodologia</h1>
      <p className="text-sm text-neutral-700">Por que densidade + viscosidade, como estimamos ABV, e o critério do semáforo. Conteúdo simplificado, com figuras a serem adicionadas.</p>
      <ul className="list-disc pl-5 text-sm">
        <li>Guia passo-a-passo (mesmos do onboarding)</li>
        <li>Limitantes: destilados secos; controle de temperatura; CV mínimo</li>
        <li>Transparência: versão do modelo/curvas e data da última atualização</li>
      </ul>
    </div>
  );
}