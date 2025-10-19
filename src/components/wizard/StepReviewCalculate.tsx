"use client"
import React from "react"
import { ProfileData, WaterTempData, DensityData, TimesData } from "@/lib/schemas"

export type WizardData = {
  profile?: ProfileData;
  waterTemp?: WaterTempData;
  density?: DensityData;
  times?: TimesData;
};

export default function StepReviewCalculate({ data, onBack, onCalculate }: {
  data: WizardData;
  onBack: () => void;
  onCalculate: () => void;
}) {
  const fmtList1d = (nums?: number[]) => (nums && nums.length ? nums.map((n) => n.toFixed(1)).join(", ") : "-")

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Revisar & Calcular</h1>
      <p className="text-sm text-neutral-700 text-justify">
        Confirme todas informações abaixo antes de calcular os resultados. Se necessário, você pode voltar pelas páginas analíticas e corrigir informações e valores.
      </p>
      <div className="space-y-2 text-sm">
        <div>
          <h2 className="font-bold">Perfil</h2>
          <p>Tipo: {data.profile?.beverageType}</p>
          {typeof data.profile?.labelAbv === 'number' ? <p>Rótulo: {data.profile.labelAbv}% v/v</p> : null}
          {data.profile?.brand && <p>Marca: {data.profile.brand}</p>}
        </div>
        <div>
          <h2 className="font-bold">Água de referência & T</h2>
          <p>Água: {data.waterTemp?.waterType}</p>
          {typeof data.waterTemp?.conductivity === 'number' && !isNaN(data.waterTemp.conductivity) ? (
            <p>Condutividade (25 °C): {data.waterTemp.conductivity} µS/cm</p>
          ) : (
            <p>Condutividade (25 °C): Não informado</p>
          )}
          <p>T: {data.waterTemp?.temperature} °C</p>
        </div>
        <div>
          <h2 className="font-bold">Densidade</h2>
          <p>Massas água: {data.density?.waterMasses?.join(", ")} g</p>
          <p>Massas amostra: {data.density?.sampleMasses?.join(", ")} g</p>
        </div>
        <div>
          <h2 className="font-bold">Tempos de escoamento</h2>
          <p>Água: {fmtList1d(data.times?.waterTimes)} s</p>
          <p>Amostra: {fmtList1d(data.times?.sampleTimes)} s</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="border rounded-lg py-3 px-4 flex-1">Voltar</button>
        <button type="button" onClick={onCalculate} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 flex-1">Calcular</button>
      </div>
    </div>
  );
}