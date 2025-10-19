"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ResultadosPage() {
  const [result, setResult] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastResult")
      if (raw) setResult(JSON.parse(raw))
    } catch {}
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Relatório | Exame de Triagem</h1>
      <header className="p-3 border rounded-lg flex items-center justify-between">
        <span className="text-sm font-medium">Semáforo</span>
        <div className="flex gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-red-500" />
        </div>
      </header>
      <section className="space-y-2 text-sm">
        <div className="border rounded-lg p-3">
          <h2 className="font-medium">Condições do ensaio</h2>
          {result ? (
            <ul className="mt-1 space-y-1">
              <li>Água: {String(result.conditions?.waterType ?? "-")}</li>
              <li>T (°C): {result.conditions?.temperature ?? "-"}</li>
              <li>Perfil: {String(result.conditions?.beverageType ?? "-")}</li>
              <li>Rótulo: {result.conditions?.labelAbv ?? "-"}% v/v</li>
            </ul>
          ) : (
            <p>T (°C), perfil, ΔV</p>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <h2 className="font-medium">Densidade</h2>
          {result ? (
            <ul className="mt-1 space-y-1">
              <li>ρ_rel: {result.density?.densityRel?.toFixed?.(4) ?? "-"}</li>
              <li>CV massa água: {result.density?.cvWaterMass?.toFixed?.(2) ?? "-"}%</li>
              <li>CV massa amostra: {result.density?.cvSampleMass?.toFixed?.(2) ?? "-"}%</li>
            </ul>
          ) : (
            <p>ρ_rel, CV_massa, ABV estimado ±1 p.p.</p>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <h2 className="font-medium">Viscosidade</h2>
          {result ? (
            <ul className="mt-1 space-y-1">
              <li>μ_rel: {result.viscosity?.viscosityRel?.toFixed?.(4) ?? "-"}</li>
              <li>CV tempo água: {result.viscosity?.cvWaterTime?.toFixed?.(2) ?? "-"}%</li>
              <li>CV tempo amostra: {result.viscosity?.cvSampleTime?.toFixed?.(2) ?? "-"}%</li>
            </ul>
          ) : (
            <p>μ_rel, CV_tempo</p>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <h2 className="font-medium">Aderência ao binário</h2>
          {result ? (
            <ul className="mt-1 space-y-1">
              <li>rμ (%): {result.adherence?.rMuPercent ?? "-"}</li>
              <li>Z-score: {result.adherence?.zScore ?? "-"}</li>
            </ul>
          ) : (
            <p>rμ (%) e Z-score</p>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <h2 className="font-medium">Compatível com rótulo?</h2>
          {result ? (
            <p>{result.labelCompat?.status} — {result.labelCompat?.reason}</p>
          ) : (
            <p>Sim/Não/Indeterminado (±2 p.p.)</p>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <h2 className="font-medium">Triagem de metanol</h2>
          {result ? (
            <p>{result.methanol?.screening}</p>
          ) : (
            <p>Não sugerido / Suspeito</p>
          )}
        </div>
        <div className="border rounded-lg p-3">
          <h2 className="font-medium">Observações</h2>
          {result ? (
            <ul className="mt-1 list-disc pl-5">
              {Array.isArray(result.observations) && result.observations.length > 0 ? (
                result.observations.map((o: string, i: number) => <li key={i}>{o}</li>)
              ) : (
                <li>Nenhuma observação</li>
              )}
            </ul>
          ) : (
            <p>CV alto, T fora do centro, whisky-like etc.</p>
          )}
        </div>
      </section>
      <div className="flex gap-2">
        {/* Removido botão Salvar */}
        <button className="border rounded-lg py-3 px-4 flex-1">Exportar PDF</button>
        <button onClick={() => router.push("/medir")} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 flex-1 disabled:bg-blue-300 disabled:cursor-not-allowed">Novo ensaio</button>
      </div>
    </div>
  )
}